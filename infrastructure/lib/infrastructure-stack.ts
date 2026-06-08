import * as cdk from 'aws-cdk-lib';
import * as budgets from 'aws-cdk-lib/aws-budgets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
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

    // SSH — restrict via context, e.g. `cdk deploy --context sshCidr=203.0.113.4/32`.
    // Default stays open because the GitHub Actions deploy SSHes in from dynamic
    // runner IPs; to fully close port 22, move the deploy to SSM Session Manager
    // (the instance role below already grants AmazonSSMManagedInstanceCore) and
    // then set sshCidr to your own IP — or drop this rule entirely.
    const sshCidr: string = this.node.tryGetContext('sshCidr') ?? '0.0.0.0/0';
    sg.addIngressRule(ec2.Peer.ipv4(sshCidr), ec2.Port.tcp(22), `SSH (${sshCidr})`);
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80),  'HTTP');
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'HTTPS');

    // ── Key Pair (CDK-managed; private key stored in SSM Parameter Store) ──
    const keyPair = new ec2.KeyPair(this, 'KeyPair', {
      keyPairName: 'manaracode-key',
    });

    // ── Contacts backup bucket (S3) + instance role ────────────────────────
    // The SQLite contacts DB lives in a Docker volume on the root EBS, so an
    // instance replacement would lose it. A nightly snapshot to this retained,
    // versioned bucket means the data survives instance loss (restore on the new
    // box). RETAIN so `cdk destroy` never deletes lead data; 30-day lifecycle.
    const backupBucket = new s3.Bucket(this, 'ContactsBackup', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      lifecycleRules: [
        {
          // 90-day recovery window for lead data (tiny SQLite dumps — cost is
          // negligible); old non-current versions expire after 30 days.
          expiration: cdk.Duration.days(90),
          noncurrentVersionExpiration: cdk.Duration.days(30),
        },
      ],
    });

    // Instance role: write backups to the bucket + SSM Session Manager access
    // (no inbound port needed; also the path to eventually close SSH — see #4).
    const serverRole = new iam.Role(this, 'ServerRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });
    backupBucket.grantPut(serverRole);

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
      // AWS CLI for the nightly S3 backup.
      'DEBIAN_FRONTEND=noninteractive apt-get install -y awscli',
      // ── #10: nightly SQLite backup to S3 ─────────────────────────────────
      // Consistent snapshot via sqlite `.backup` from a throwaway container that
      // mounts the compose data volume (project "manaracode" → volume
      // manaracode_contacts-data). Skips cleanly until the stack/volume exists.
      `cat >/usr/local/bin/backup-contacts.sh <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail
VOLUME=manaracode_contacts-data
docker volume inspect "$VOLUME" >/dev/null 2>&1 || { echo "no volume yet"; exit 0; }
TS=$(date +%F-%H%M%S)
TMP=$(mktemp)
docker run --rm -v "$VOLUME":/data alpine:3 sh -c \\
  'apk add --no-cache sqlite >/dev/null 2>&1 && sqlite3 /data/contacts.db ".backup /data/.bak.db" && cat /data/.bak.db && rm -f /data/.bak.db' > "$TMP"
# Never upload an empty/partial file (a failed .backup yields no stdout).
[ -s "$TMP" ] || { echo "backup produced no data; aborting"; rm -f "$TMP"; exit 1; }
aws s3 cp "$TMP" "s3://${backupBucket.bucketName}/contacts-$TS.db.sqlite"
rm -f "$TMP"
SCRIPT`,
      'chmod +x /usr/local/bin/backup-contacts.sh',
      "echo '17 3 * * * root /usr/local/bin/backup-contacts.sh >> /var/log/backup-contacts.log 2>&1' >/etc/cron.d/manaracode-backup",
      'chmod 0644 /etc/cron.d/manaracode-backup',
      // ── #16: bring the stack up on boot (and after `down`) ───────────────
      `cat >/etc/systemd/system/manaracode.service <<'UNIT'
[Unit]
Description=manaracode docker compose stack
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/manaracode
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
UNIT`,
      'systemctl daemon-reload',
      'systemctl enable manaracode.service',
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
      role: serverRole,
      userData,
      blockDevices: [{
        deviceName: '/dev/sda1',
        volume: ec2.BlockDeviceVolume.ebs(20, {
          volumeType: ec2.EbsDeviceVolumeType.GP3,
        }),
      }],
    });

    // ── Monthly Budget + email alerts ──────────────────────────────────────
    // Set the alert recipient (and optionally the limit) via CDK context:
    //   cdk deploy --context budgetLimitUsd=20 --context budgetAlertEmail=you@example.com
    // The placeholder default is non-routable on purpose — always pass your own.
    const budgetLimitUsd = Number(this.node.tryGetContext('budgetLimitUsd') ?? 15);
    const budgetAlertEmail: string = this.node.tryGetContext('budgetAlertEmail') ?? 'alerts@example.com';

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

    new cdk.CfnOutput(this, 'BackupBucket', {
      value: backupBucket.bucketName,
      description: 'S3 bucket holding nightly SQLite contacts backups',
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
