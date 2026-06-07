import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { ManaracodeStack } from '../lib/infrastructure-stack';

const ENV = { account: '123456789012', region: 'us-east-1' };

describe('ManaracodeStack', () => {
  const app = new cdk.App();
  const stack = new ManaracodeStack(app, 'TestStack', { env: ENV });
  const t = Template.fromStack(stack);

  test('contacts backup bucket is versioned, private, retained, SSL-only (#10)', () => {
    t.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: { Status: 'Enabled' },
      PublicAccessBlockConfiguration: Match.objectLike({
        BlockPublicPolicy: true,
        RestrictPublicBuckets: true,
      }),
    });
    t.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Retain' });
    // enforceSSL emits a bucket policy denying non-TLS access.
    t.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Deny',
            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
          }),
        ]),
      },
    });
  });

  test('instance role can write backups (s3:PutObject) + has SSM core (#10/#4)', () => {
    t.resourceCountIs('AWS::IAM::Role', 1);
    t.resourceCountIs('AWS::IAM::InstanceProfile', 1);
    // grantPut → inline policy allowing PutObject to the bucket.
    t.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({ Action: Match.arrayWith(['s3:PutObject']) }),
        ]),
      },
    });
    // AmazonSSMManagedInstanceCore managed policy attached to the role.
    t.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: Match.arrayWith([
        Match.objectLike({
          'Fn::Join': Match.arrayWith([
            Match.arrayWith([Match.stringLikeRegexp('AmazonSSMManagedInstanceCore')]),
          ]),
        }),
      ]),
    });
  });

  test('security group exposes 22/80/443; SSH defaults open (#4)', () => {
    t.hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: Match.arrayWith([
        Match.objectLike({ FromPort: 22, ToPort: 22, CidrIp: '0.0.0.0/0' }),
        Match.objectLike({ FromPort: 80, ToPort: 80, CidrIp: '0.0.0.0/0' }),
        Match.objectLike({ FromPort: 443, ToPort: 443, CidrIp: '0.0.0.0/0' }),
      ]),
    });
  });

  test('sshCidr context overrides the SSH ingress CIDR (#4)', () => {
    const app2 = new cdk.App({ context: { sshCidr: '203.0.113.4/32' } });
    const t2 = Template.fromStack(new ManaracodeStack(app2, 'OverrideStack', { env: ENV }));
    t2.hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: Match.arrayWith([
        Match.objectLike({ FromPort: 22, ToPort: 22, CidrIp: '203.0.113.4/32' }),
      ]),
    });
    // 80/443 stay world-open.
    t2.hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: Match.arrayWith([
        Match.objectLike({ FromPort: 443, CidrIp: '0.0.0.0/0' }),
      ]),
    });
  });

  test('single EC2 instance + monthly budget still present', () => {
    t.resourceCountIs('AWS::EC2::Instance', 1);
    t.resourceCountIs('AWS::Budgets::Budget', 1);
  });

  test('UserData installs the boot-time systemd unit and backup cron (#16/#10)', () => {
    const [instance] = Object.values(t.findResources('AWS::EC2::Instance'));
    const userData = JSON.stringify(instance.Properties.UserData);
    expect(userData).toContain('manaracode.service');
    expect(userData).toContain('backup-contacts.sh');
    expect(userData).toContain('manaracode-backup');
  });
});
