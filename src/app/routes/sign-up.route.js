import { UserDTO } from "../dto/user.dto.js";
import { SignUpUseCase } from "../../core/usecases/signup.usecase.js";
import { SignUpCognitoRepository } from "../../infra/repository/sign-up.cognito.repository.js";

export const signUpRoute = (applications) => {
  return applications.post("/sign-up", async (req, res) => {
    const userDTO = new UserDTO(req.body);

    const signUpRepository = new SignUpCognitoRepository({
      // eslint-disable-next-line no-undef
      region: process.env.AWS_COGNITO_REGION,

      // eslint-disable-next-line no-undef
      userPoolId: process.env.AWS_COGNITO_POOL_ID,

      // eslint-disable-next-line no-undef
      clientId: process.env.AWS_COGNITO_CLIENT_ID,
    });

    const instanceUseCase = new SignUpUseCase(signUpRepository, userDTO);
    const response = await instanceUseCase.execute();

    if (!response.code) {
      res.status(201).json(response);
      return;
    }

    if (response.code === "NotAuthorizedException") {
      res.status(401).json(response);

      return;
    }

    return res.status(400).json(response);
  });
};
