import { Stack, StackProps } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import {
  ARecord,
  HostedZone,
  NsRecord,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export interface CertificateStackProps extends StackProps {
  readonly rootHostedZoneId: string;
  readonly rootHostedZoneName: string;
  readonly subDomainName: string;
}

export class CertificateStack extends Stack {
  private readonly _certificateArn: string;
  private readonly hostedZone: HostedZone;
  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    const rootHostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      "RootHostedZone",
      {
        hostedZoneId: props.rootHostedZoneId,
        zoneName: props.rootHostedZoneName,
      },
    );

    this.hostedZone = new HostedZone(this, "HostedZone", {
      zoneName: `${props.subDomainName}.${props.rootHostedZoneName}`,
    });

    new NsRecord(this, "NsRecord", {
      zone: rootHostedZone,
      recordName: props.subDomainName,
      values: this.hostedZone.hostedZoneNameServers!,
    });

    const certificate = new Certificate(this, "Certificate", {
      domainName: `${props.subDomainName}.${props.rootHostedZoneName}`,
      validation: CertificateValidation.fromDns(this.hostedZone),
    });

    this._certificateArn = certificate.certificateArn;
  }

  get certificateArn(): string {
    return this._certificateArn;
  }

  addCloudfrontDelegation(distributionId: string, domainName: string): void {
    new ARecord(this, "AliasRecord", {
      zone: this.hostedZone,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(
          Distribution.fromDistributionAttributes(this, "Distribution", {
            distributionId: distributionId,
            domainName: domainName,
          }),
        ),
      ),
    });
  }
}
