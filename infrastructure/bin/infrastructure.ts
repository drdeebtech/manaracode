#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ManaracodeStack } from '../lib/infrastructure-stack';

const app = new cdk.App();

// Environment-agnostic: region/account resolved from AWS CLI profile or
// CDK_DEFAULT_ACCOUNT / CDK_DEFAULT_REGION at deploy time.
new ManaracodeStack(app, 'ManaracodeStack');
