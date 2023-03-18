import AWS from "aws-sdk";

export class SignUpCognitoRepository {
  #cognito;
  #cognitoClientId;

  /**
   * @param {Object} inputArgs
   */
  constructor(inputArgs) {
    const { clientId, region } = inputArgs;

    this.#validateInputs({ clientId, region });

    this.#cognitoClientId = clientId;
    this.cognito = new AWS.CognitoIdentityServiceProvider({
      region: region,
    });
  }

  #validateInputs(args) {
    const { clientId, region } = args;

    if (!region) {
      throw new Error("The field region is required");
    }

    if (!clientId) {
      throw new Error("The field clientId is required");
    }

    if (typeof region !== "string" || typeof clientId !== "string") {
      throw new Error("The values to need be a string");
    }
  }

  /**
   * Insert a new user in the AWS Cognito
   * @param {Object} dataUser
   */
  async addUser(dataUser) {
    const paramters = {
      ClientId: this.#cognitoClientId,
      Username: dataUser.email,
      Password: dataUser.password,
      UserAttributes: [
        {
          Name: "name",
          Value: dataUser.name,
        },
        {
          Name: "email",
          Value: dataUser.email,
        },
      ],
    };

    const response = await this.cognito.signUp(paramters).promise();

    if (response.UserSub) {
      return true;
    }

    return false;
  }
}
