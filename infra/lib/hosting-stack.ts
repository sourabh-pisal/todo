import { Stack, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path = require("path");

const ASSET_PATH = path.resolve(__dirname, "../../todo-app/build");

export interface HostingStackProps extends StackProps {
  readonly certificateArn: string;
  readonly certficateDomainName: string;
}

export class HostingStack extends Stack {
  private readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: HostingStackProps) {
    super(scope, id, props);

    const hostingBucket = new Bucket(this, "HostingBucket", {
      accessControl: BucketAccessControl.PRIVATE,
    });

    new BucketDeployment(this, "BucketDeployment", {
      destinationBucket: hostingBucket,
      sources: [Source.asset(ASSET_PATH)],
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity",
    );

    hostingBucket.grantRead(originAccessIdentity);

    this.distribution = new Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(hostingBucket, { originAccessIdentity }),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
        cachedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: Certificate.fromCertificateArn(
        this,
        "Certificate",
        props.certificateArn,
      ),
      domainNames: [props.certficateDomainName],
    });
  }

  get distributionId(): string {
    return this.distribution.distributionId;
  }

  get distributionDomainName(): string {
    return this.distribution.distributionDomainName;
  }
}
