import * as cdk from 'aws-cdk-lib';
import * as budgets from 'aws-cdk-lib/aws-budgets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class ManaracodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── VPC ────────────────────────────────────────────────────────────────
    // natGateways: 0 avoids ~$32/month NAT cost. The EC2 instance is placed
    // in a public subnet so it can reach the internet directly. Private
    // subnets are isolated until a NAT gateway is added.
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // ── Security Group ──────────────────────────────────────────────────────
    const sg = new ec2.SecurityGroup(this, 'ServerSG', {
      vpc,
      description: 'Manaracode server: SSH + HTTP + HTTPS',
      allowAllOutbound: true,
    });

    // SSH — currently open to all; restrict to your IP after provisioning:
    //   ec2.Peer.ipv4('x.x.x.x/32')
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22),  'SSH (tighten to your IP post-deploy)');
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80),  'HTTP');
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'HTTPS');

    // ── Key Pair (CDK-managed; private key stored in SSM Parameter Store) ──
    const keyPair = new ec2.KeyPair(this, 'KeyPair', {
      keyPairName: 'manaracode-key',
    });

    // ── Ubuntu 24.04 LTS AMI (resolved per-region via Canonical SSM path) ──
    const ubuntu = ec2.MachineImage.fromSsmParameter(
      '/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id',
      { os: ec2.OperatingSystemType.LINUX },
    );

    // ── UserData — Docker + Docker Compose v2 + /opt/manaracode directory ──
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'set -euo pipefail',
      'exec > >(tee /var/log/userdata.log) 2>&1',
      'echo "=== UserData start ==="',
      // 2GB swap — t3.micro has 1GB RAM; Docker builds/pulls without swap
      // caused hard freezes on the previous server (OOM "Deep Freeze").
      'fallocate -l 2G /swapfile',
      'chmod 600 /swapfile',
      'mkswap /swapfile',
      'swapon /swapfile',
      'echo "/swapfile none swap sw 0 0" >> /etc/fstab',
      'apt-get update && DEBIAN_FRONTEND=noninteractive apt-get upgrade -y',
      // Docker (official install script)
      'curl -fsSL https://get.docker.com | sh',
      'systemctl enable docker',
      'systemctl start docker',
      'usermod -aG docker ubuntu',
      // Docker Compose v2 plugin
      'apt-get install -y docker-compose-plugin',
      // App directory — deploy-remote.sh expects this path
      'mkdir -p /opt/manaracode',
      'chown ubuntu:ubuntu /opt/manaracode',
      'echo "=== UserData complete ==="',
    );

    // ── EC2 Instance ────────────────────────────────────────────────────────
    const instance = new ec2.Instance(this, 'Server', {
      vpc,
      vpcSubnets:   { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ubuntu,
      securityGroup: sg,
      keyPair,
      userData,
      blockDevices: [{
        deviceName: '/dev/sda1',
        volume: ec2.BlockDeviceVolume.ebs(20, {
          volumeType: ec2.EbsDeviceVolumeType.GP3,
        }),
      }],
    });

    // ── Monthly Budget + email alerts ──────────────────────────────────────
    // Override limit/email via CDK context:
    //   cdk deploy --context budgetLimitUsd=20 --context budgetAlertEmail=you@example.com
    const budgetLimitUsd = Number(this.node.tryGetContext('budgetLimitUsd') ?? 15);
    const budgetAlertEmail: string = this.node.tryGetContext('budgetAlertEmail') ?? 'dreldeeburo@gmail.com';

    const alertSubscribers = (email: string) => [{ subscriptionType: 'EMAIL', address: email }];

    new budgets.CfnBudget(this, 'MonthlyBudget', {
      budget: {
        budgetName: 'ManaracodeMonthly',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: { amount: budgetLimitUsd, unit: 'USD' },
      },
      notificationsWithSubscribers: [
        {
          notification: {
            notificationType: 'ACTUAL',
            comparisonOperator: 'GREATER_THAN',
            threshold: 80,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: alertSubscribers(budgetAlertEmail),
        },
        {
          notification: {
            notificationType: 'ACTUAL',
            comparisonOperator: 'GREATER_THAN',
            threshold: 100,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: alertSubscribers(budgetAlertEmail),
        },
        {
          // Warn early if AWS projects you'll overshoot before month-end
          notification: {
            notificationType: 'FORECASTED',
            comparisonOperator: 'GREATER_THAN',
            threshold: 100,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: alertSubscribers(budgetAlertEmail),
        },
      ],
    });

    // ── Outputs ─────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'PublicIP', {
      value: instance.instancePublicIp,
      description: 'EC2 public IP address',
    });

    new cdk.CfnOutput(this, 'PublicDNS', {
      value: instance.instancePublicDnsName,
      description: 'EC2 public DNS name',
    });

    new cdk.CfnOutput(this, 'RetrieveSSHKey', {
      value: [
        `aws ssm get-parameter`,
        `  --name /ec2/keypair/${keyPair.keyPairId}`,
        `  --with-decryption`,
        `  --query Parameter.Value`,
        `  --output text > manaracode-key.pem`,
        `&& chmod 400 manaracode-key.pem`,
      ].join(' '),
      description: 'Command to download the private SSH key from SSM',
    });

    new cdk.CfnOutput(this, 'SSHCommand', {
      value: `ssh -i manaracode-key.pem ubuntu@${instance.instancePublicIp}`,
      description: 'SSH into the instance once the key is retrieved',
    });
  }
}
