import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { ManaracodeStack } from '../lib/infrastructure-stack';

describe('ManaracodeStack', () => {
  const app = new cdk.App();
  const stack = new ManaracodeStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });
  const t = Template.fromStack(stack);

  test('contacts backup bucket is versioned, private, and retained (#10)', () => {
    t.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: { Status: 'Enabled' },
      PublicAccessBlockConfiguration: Match.objectLike({
        BlockPublicPolicy: true,
        RestrictPublicBuckets: true,
      }),
    });
    // RETAIN so lead data is never deleted by `cdk destroy`.
    t.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Retain' });
  });

  test('instance has an IAM role + instance profile (backup + SSM) (#10/#4)', () => {
    t.resourceCountIs('AWS::IAM::Role', 1);
    t.resourceCountIs('AWS::IAM::InstanceProfile', 1);
  });

  test('security group exposes 22/80/443 (#4: 22 cidr is overridable)', () => {
    t.hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: Match.arrayWith([
        Match.objectLike({ FromPort: 22, ToPort: 22 }),
        Match.objectLike({ FromPort: 80, ToPort: 80, CidrIp: '0.0.0.0/0' }),
        Match.objectLike({ FromPort: 443, ToPort: 443, CidrIp: '0.0.0.0/0' }),
      ]),
    });
  });

  test('single EC2 instance + monthly budget still present', () => {
    t.resourceCountIs('AWS::EC2::Instance', 1);
    t.resourceCountIs('AWS::Budgets::Budget', 1);
  });

  test('UserData installs the boot-time systemd unit and backup cron (#16/#10)', () => {
    const instances = t.findResources('AWS::EC2::Instance');
    const [instance] = Object.values(instances);
    // UserData is base64-encoded via Fn::Base64 over an Fn::Join of strings.
    const userData = JSON.stringify(instance.Properties.UserData);
    expect(userData).toContain('manaracode.service');
    expect(userData).toContain('backup-contacts.sh');
    expect(userData).toContain('manaracode-backup');
  });
});
