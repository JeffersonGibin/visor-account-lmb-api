import serverless from "serverless-http";
import express from "express";
import { signUpRoute } from "./src/app/routes/sign-up.route.js";
import { RoutesHandler } from "./src/handler/routes-handler.js";

const app = express();
app.use(express.json());

// router list
const routes = [signUpRoute];

// apply routes
new RoutesHandler(app, routes).apply();

export const handler = serverless(app);
