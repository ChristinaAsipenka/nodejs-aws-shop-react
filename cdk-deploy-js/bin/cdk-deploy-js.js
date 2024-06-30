#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { CdkDeployJsStack } = require('../lib/cdk-deploy-js-stack');

const app = new cdk.App();
new CdkDeployJsStack(app, 'CdkDeployJsStack', {});
