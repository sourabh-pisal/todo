import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CertificateStack } from "../lib/certificate-stack";

test("snapshot", () => {
  const app = new App();
  const certificateStack = new CertificateStack(
    app,
    "TodoAppCertificateStack",
    {
      rootHostedZoneName: "test.com",
      rootHostedZoneId: "hosted-zone-id",
      subDomainName: "sub-domain-name",
    },
  );
  const template = Template.fromStack(certificateStack);
  expect(template.toJSON()).toMatchSnapshot();
});
