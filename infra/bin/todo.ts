#!/usr/bin/env node
import { App, Tags } from "aws-cdk-lib";
import "source-map-support/register";
import { TodoStack } from "../lib/todo-stack";
import path = require("path");

const app = new App();

new TodoStack(app, "TodoStack", {
  env: { region: "us-east-1" },
  hostedZoneId: "{{resolve:ssm:/hosted-zone/root}}",
  domainName: "todo.sourabhpisal.com",
  assetPath: path.resolve(__dirname, "../../todo-app/build"),
});

Tags.of(app).add("Application", "Todo");
