const cdk = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const s3deploy = require('aws-cdk-lib/aws-s3-deployment');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const { Stack, RemovalPolicy } = cdk;
const iam  = require('aws-cdk-lib/aws-iam');


class CdkDeployJsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'JSCC-OAI');
    const bucketName = 'aws-course-bucket-ca';

    const bucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: bucketName,
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const policyStatement = new iam.PolicyStatement({
      actions: ["S3:GetObject"],
      resources: [bucket.arnForObjects("*")],
      principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    })

    bucket.addToResourcePolicy(policyStatement);

    const distribution = new cloudfront.CloudFrontWebDistribution(this, "JSCC-distribution", {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: cloudfrontOAI
        },
        behaviors: [{
          isDefaultBehavior: true
        }]
      }]
    });

    new s3deploy.BucketDeployment(this, "JSCC-Bucket-Deployment", {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    })

    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionDomainName', { value: distribution.domainName });
  }
}
module.exports = { CdkDeployJsStack };