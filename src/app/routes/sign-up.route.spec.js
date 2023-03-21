import request from "supertest";
import { signUpRoute } from "./sign-up.route.js";
import express from "express";

import { SignUpCognitoRepository } from "../../infra/repository/sign-up.cognito.repository.js";

import { CustomException } from "../../core/exceptions/custom.exception.js";

jest.mock("../../infra/repository/sign-up.cognito.repository.js");

let app;

describe("sign-up.route.spec unit test", () => {
  beforeAll(() => {
    app = express();
    app.use(express.json());
    signUpRoute(app);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 201 when user is successfully created", async () => {
    SignUpCognitoRepository.prototype.addUser = jest
      .fn()
      .mockResolvedValue(true);

    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    };
    const response = await request(app).post("/sign-up").send(userData);
    expect(response.status).toBe(201);
  });

  it("should return status 401 when user creation fails", async () => {
    SignUpCognitoRepository.prototype.addUser = jest
      .fn()
      .mockRejectedValue(
        new CustomException("mock message", "UsernameExistsException")
      );

    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    };

    const response = await request(app).post("/sign-up").send(userData);
    expect(response.status).toBe(400);
  });
});
