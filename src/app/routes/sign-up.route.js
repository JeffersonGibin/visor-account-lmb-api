import { UserDTO } from "../dto/user.dto.js";
import { SignUpUseCase } from "../../core/usecases/signup.usecase.js";
import { SignUpCognitoRepository } from "../../infra/repository/sign-up.cognito.repository.js";

export const signUpRoute = (applications) => {
  return applications.post("/sign-up", async (req, res, next) => {
    const userDTO = new UserDTO(req.body);

    const signUpRepository = new SignUpCognitoRepository({
      region: process.env.AWS_COGNITO_REGION,
      clientId: process.env.AWS_COGNITO_CLIENT_ID,
    });

    const instanceUseCase = new SignUpUseCase(signUpRepository, userDTO);
    const responseToRoute = await instanceUseCase.execute();

    const httpStatusCode = responseToRoute.status === "SUCCESS" ? 201 : 401;
    return res.status(httpStatusCode).json({
      message: responseToRoute.message,
    });
  });
};
