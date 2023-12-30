import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { TodoStack } from "../lib/todo-stack";
import path = require("path");

test("snapshot", () => {
  const app = new App();
  const todoStack = new TodoStack(app, "TodoStack", {
    env: { region: "us-east-1" },
    hostedZoneId: "random-hosted-zone-id",
    domainName: "random-domain-name",
    assetPath: path.resolve(__dirname, "../../todo-app/build"),
  });

  const template = Template.fromStack(todoStack);
  expect(template.toJSON()).toMatchSnapshot();
});
