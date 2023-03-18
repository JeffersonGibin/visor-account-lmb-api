import { SignUpCognitoRepository } from "./sign-up.cognito.repository.js";
import AWS from "aws-sdk";

jest.mock("aws-sdk");

const signUpFn = jest.fn();

describe("sign-up.cognito.repository unit test", () => {
  describe("addUser method", () => {
    beforeAll(() => {
      AWS.CognitoIdentityServiceProvider = jest.fn().mockImplementation(() => {
        return {
          signUp: signUpFn.mockReturnValue({
            promise: jest.fn().mockResolvedValue({
              UserSub: "1",
            }),
          }),
        };
      });
    });

    it("should return true when add user", async () => {
      const instance = new SignUpCognitoRepository({
        clientId: "1a2b3c",
        region: "us-east1",
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
        };
      });

      const instance = new SignUpCognitoRepository({
        clientId: "1a2b3c",
        region: "us-east1",
      });

      const result = await instance.addUser({
        name: "Josh",
        email: "exemple@exemple.com",
        password: "123456v",
      });

      expect(result).toBeFalsy();
    });

    it("should call addUser correctly", async () => {
      const signUpFn = jest.fn();
      AWS.CognitoIdentityServiceProvider = jest.fn().mockImplementation(() => {
        return {
          signUp: signUpFn.mockReturnValue({
            promise: jest.fn().mockResolvedValue({
              UserSub: "1",
            }),
          }),
        };
      });

      const instance = new SignUpCognitoRepository({
        clientId: "1a2b3c",
        region: "us-east1",
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
        ClientMetadata: {
          preference: "CONFIRMED"
        },
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
      ${"clientId"} | ${"don't is string"} | ${"{\"clientId\": 1, \"region\": \"us-east1\"}"}    | ${"The values to need be a string"}
      ${"region"}   | ${"don't is string"} | ${"{\"clientId\": \"1a2b3c\", \"region\": 1}"}      | ${"The values to need be a string"}
      ${"clientId"} | ${"is null"}         | ${"{\"clientId\": null, \"region\": \"us-east1\"}"} | ${"The field clientId is required"}
      ${"region"}   | ${"is null"}         | ${"{\"clientId\": \"1a2b3c\", \"region\": null}"}   | ${"The field region is required"}
      ${"clientId"} | ${"is blank"}        | ${"{\"clientId\": \"\", \"region\": \"us-east1\"}"}   | ${"The field clientId is required"}
      ${"region"}   | ${"is blank"}        | ${"{\"clientId\": \"1a2b3c\", \"region\": \"\"}"}     | ${"The field region is required"}
    `(
      "should return exception when '$field' $expresion",
      ({ args, expected }) => {
        const input = JSON.parse(args);
        const region = input["region"];
        const clientId = input["clientId"];

        expect(() => {
          new SignUpCognitoRepository({
            clientId,
            region,
          });
        }).toThrow(new Error(expected));
      }
    );
  });
});
