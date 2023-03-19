/* eslint-disable quotes */
import { SignUpCognitoRepository } from "./sign-up.cognito.repository.js";
import AWS from "aws-sdk";

jest.mock("aws-sdk");

const signUpFn = jest.fn();
const adminConfirmSignUpFn = jest.fn();

describe("sign-up.cognito.repository unit test", () => {
  beforeAll(() => {
    AWS.CognitoIdentityServiceProvider = jest.fn().mockImplementation(() => {
      return {
        signUp: signUpFn.mockReturnValue({
          promise: jest.fn().mockResolvedValue({
            UserSub: "1",
          }),
        }),
        adminConfirmSignUp: adminConfirmSignUpFn.mockReturnValue({
          promise: jest.fn().mockResolvedValue({}),
        }),
      };
    });
  });

  describe("addUser method", () => {

    it("should return true when add user", async () => {
      const instance = new SignUpCognitoRepository({
        clientId: "1a2b3c",
        region: "us-east1",
        userPoolId: "123"
      });

      const result = await instance.addUser({
        name: "Josh",
        email: "exemple@exemple.com",
        password: "123456v",
      });

      expect(result).toBeTruthy();
    });

    it("should return false when don't adduser", async () => {
      AWS.CognitoIdentityServiceProvider = jest.fn().mockImplementation(() => {
        return {
          signUp: signUpFn.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
          }),
          adminConfirmSignUp: adminConfirmSignUpFn.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
          }),
        };
      });

      const instance = new SignUpCognitoRepository({
        clientId: "1a2b3c",
        region: "us-east1",
        userPoolId: "123"
      });

      const result = await instance.addUser({
        name: "Josh",
        email: "exemple@exemple.com",
        password: "123456v",
      });

      expect(result).toBeFalsy();
    });

    it("should call addUser correctly", async () => {
      const instance = new SignUpCognitoRepository({
        clientId: "1a2b3c",
        region: "us-east1",
        userPoolId: "123"
      });

      const spyOnAddUser = jest.spyOn(
        SignUpCognitoRepository.prototype,
        "addUser"
      );

      await instance.addUser({
        name: "Josh",
        email: "exemple@exemple.com",
        password: "123456v",
      });

      expect(signUpFn).toBeCalledWith({
        ClientId: "1a2b3c",
        Username: "exemple@exemple.com",
        Password: "123456v",
        UserAttributes: [
          {
            Name: "name",
            Value: "Josh",
          },
          {
            Name: "email",
            Value: "exemple@exemple.com",
          },
        ],
      });

      expect(spyOnAddUser).toBeCalledWith({
        name: "Josh",
        email: "exemple@exemple.com",
        password: "123456v",
      });
    });
  });

  describe("exceptions", () => {
    it.each`
      field         | expresion            | args                                          | expected
      ${"clientId"} | ${"don't is string"} | ${'{"clientId": 1, "region": "us-east1", "userPoolId": "us-east1-a1b123a"}'}   | ${'The values to need be a string'}
      ${"region"} | ${"don't is string"} | ${'{"clientId": "1a2b3c", "region": 1, "userPoolId": "us-east1-a1b123a"}'}   | ${'The values to need be a string'}
      ${"userPoolId"} | ${"don't is string"} | ${'{"clientId": "1a2b3c", "region": "us-east1", "userPoolId": 1}'}   | ${'The values to need be a string'}
      ${"clientId"} | ${"is null"}         | ${'{"clientId": null, "region": "us-east1", "userPoolId": 1}'}  | ${"The field clientId is required"}
      ${"region"} | ${"is null"}         | ${'{"clientId": "1a2b3c", "region": null, "userPoolId": 1}'}  | ${"The field region is required"}
      ${"userPoolId"} | ${"is null"}         | ${'{"clientId": "1a2b3c", "region": "us-east1", "userPoolId": null}'}  | ${"The field userPoolId is required"}
      ${"clientId"} | ${"is blank"}         | ${'{"clientId": "", "region": "us-east1", "userPoolId": 1}'}  | ${"The field clientId is required"}
      ${"region"} | ${"is blank"}         | ${'{"clientId": "1a2b3c", "region": "", "userPoolId": 1}'}  | ${"The field region is required"}
      ${"userPoolId"} | ${"is blank"}         | ${'{"clientId": "1a2b3c", "region": "us-east1", "userPoolId": ""}'}  | ${"The field userPoolId is required"}
    `(
      "should return exception when '$field' $expresion",
      ({ args, expected }) => {
        const input = JSON.parse(args);
        const region = input["region"];
        const clientId = input["clientId"];
        const userPoolId = input["userPoolId"];

        expect(() => {
          new SignUpCognitoRepository({
            clientId,
            region,
            userPoolId
          });
        }).toThrow(new Error(expected));
      }
    );
  });
});
