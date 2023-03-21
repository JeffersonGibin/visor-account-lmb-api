/* eslint-disable quotes */
import { CustomException } from "../exceptions/custom.exception.js";
import { SignUpUseCase } from "./signup.usecase.js";

describe("signup.usecase unit test", () => {
  describe("scenario success", () => {
    it("should to return success when adduser", async () => {
      const mockRepository = {
        addUser: jest.fn(),
      };

      const userDto = {
        name: "Jefferson",
        email: "exemple@exemple.com",
        password: "123456m",
      };

      const instanceUseCase = new SignUpUseCase(mockRepository, userDto);
      const result = await instanceUseCase.execute();

      expect(result).toEqual({
        message: "OK",
        status: "SUCCESS",
      });
    });
  });

  describe("scenario error", () => {
    it.each`
      exceptionCode                  | expected
      ${"InvalidPasswordException"}  | ${'{"code": "InvalidPasswordException", "message": "mock message", "status": "ERROR" }'}
      ${"InvalidParameterException"} | ${'{"code": "InvalidParameterException", "message": "mock message", "status": "ERROR" }'}
      ${"InvalidParameterType"}      | ${'{"code": "InvalidParameterType", "message": "mock message", "status": "ERROR" }'}
      ${"UsernameExistsException"}   | ${'{"code": "UsernameExistsException", "message": "mock message", "status": "ERROR" }'}
      ${"Other"}                     | ${'{"code": "GenericValidationError", "message": "Validation Error", "status": "ERROR" }'}
    `(
      "should to return error when exception code is $exceptionCode",
      async ({ exceptionCode, expected }) => {
        const mockRepository = {
          addUser: jest.fn().mockImplementation(() => {
            throw new CustomException("mock message", exceptionCode);
          }),
        };

        const userDto = {
          name: "Jefferson",
          email: "exemple@exemple.com",
          password: "123456m",
        };

        const instanceUseCase = new SignUpUseCase(mockRepository, userDto);
        const result = await instanceUseCase.execute();

        const parseExpectedResult = JSON.parse(expected);
        expect(result).toEqual(parseExpectedResult);
      }
    );
  });
});
