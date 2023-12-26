#!/usr/bin/env node
import { App, Tags } from "aws-cdk-lib";
import "source-map-support/register";
import { CertificateStack } from "../lib/certificate-stack";
import { HostingStack } from "../lib/hosting-stack";

const app = new App();

const certificateStack = new CertificateStack(app, "TodoAppCertificateStack", {
  env: { region: "us-east-1" },
  rootHostedZoneName: "sourabhpisal.com",
  rootHostedZoneId: "{{resolve:ssm:/hosted-zone/root}}",
  subDomainName: "todo",
  crossRegionReferences: true,
});

const hostingStack = new HostingStack(app, "ApplicationHostingStack", {
  env: { region: "eu-west-1" },
  certificateArn: certificateStack.certificateArn,
  certficateDomainName: "todo.sourabhpisal.com",
  crossRegionReferences: true,
});

certificateStack.addCloudfrontDelegation(
  hostingStack.distributionId,
  hostingStack.distributionDomainName,
);

Tags.of(app).add("Application", "Todo");
