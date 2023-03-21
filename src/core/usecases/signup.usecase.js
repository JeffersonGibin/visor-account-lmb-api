const exceptions = [
  "InvalidPasswordException",
  "InvalidParameterException",
  "InvalidParameterType",
  "UsernameExistsException",
];

export class SignUpUseCase {
  #signUpRepository;
  #userDTO;

  constructor(repository, userDTO) {
    this.#signUpRepository = repository;
    this.#userDTO = userDTO;
  }

  async execute() {
    try {
      await this.#signUpRepository.addUser({
        name: this.#userDTO.name,
        email: this.#userDTO.email,
        password: this.#userDTO.password,
      });

      return {
        status: "SUCCESS",
        message: "OK",
      };
    } catch (error) {
      const messageError = error.message;
      const exceptionCode = error.code;

      if (exceptions.includes(exceptionCode)) {
        return {
          status: "ERROR",
          code: exceptionCode,
          message: messageError,
        };
      }

      console.log("[SignUpUseCase]", error);

      return {
        status: "ERROR",
        code: "GenericValidationError",
        message: "Validation Error",
      };
    }
  }
}
