import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { HostingStack } from "../lib/hosting-stack";

test("snapshot", () => {
  const app = new App();
  const hostingStack = new HostingStack(app, "ApplicationHostingStack", {
    certificateArn: "arn:aws:acm:us-east-1:*:certificate/jidafosjfioasjfp",
    certficateDomainName: "domain-name",
  });
  const template = Template.fromStack(hostingStack);
  expect(template.toJSON()).toMatchSnapshot();
});
