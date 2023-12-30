import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
// import { Certificate } from "./constructs/certificate";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { CfnRecordSet, HostedZone } from "aws-cdk-lib/aws-route53";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";

export interface HostingStackProps extends StackProps {
  readonly hostedZoneId: string;
  readonly domainName: string;
  readonly assetPath: string;
}

export class TodoStack extends Stack {
  constructor(scope: Construct, id: string, props: HostingStackProps) {
    super(scope, id, props);

    const hostedZone = new HostedZone(this, "HostedZone", {
      zoneName: props.domainName,
    });

    const nsRecord = new CfnRecordSet(this, "NsRecord", {
      name: props.domainName,
      type: "NS",
      hostedZoneId: props.hostedZoneId,
      ttl: "1800",
      resourceRecords: hostedZone.hostedZoneNameServers,
    });

    const certificate = new Certificate(this, "Certificate", {
      domainName: props.domainName,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    certificate.node.addDependency(nsRecord);

    const hostingBucket = new Bucket(this, "Bucket", {
      accessControl: BucketAccessControl.PRIVATE,
    });

    new BucketDeployment(this, "BucketDeployment", {
      destinationBucket: hostingBucket,
      sources: [Source.asset(props.assetPath)],
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    hostingBucket.grantRead(originAccessIdentity);

    new Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(hostingBucket, { originAccessIdentity }),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
        cachedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: certificate,
      domainNames: [props.domainName],
    });
  }
}
