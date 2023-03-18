import serverless from "serverless-http";
import express from "express";
import { RoutesHandler } from "./src/handler/routes-handler.js";
import { signInRoute } from "./src/app/routes/sign-in.route.js";

const app = express();
const authRouter = express.Router();

// Parse to Json
authRouter.use(express.json());

// Define the Context of api
app.use("/account", authRouter);

// router list
const routes = [signInRoute];

// apply routes
new RoutesHandler(authRouter, routes).apply();

export const handler = serverless(app);
