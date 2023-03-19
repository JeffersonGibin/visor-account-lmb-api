import AWS from "aws-sdk";

export class SignUpCognitoRepository {
  #cognito;
  #cognitoClientId;
  #userPoolId;

  /**
   * @param {Object} inputArgs
   */
  constructor(inputArgs) {
    const { clientId, userPoolId, region } = inputArgs;

    this.#validateInputs({ clientId, userPoolId, region });

    this.#cognitoClientId = clientId;
    this.#userPoolId = userPoolId;
    this.cognito = new AWS.CognitoIdentityServiceProvider({
      region: region,
    });
  }

  #validateInputs(args) {
    const { clientId, userPoolId, region } = args;

    if (!clientId) {
      throw new Error("The field clientId is required");
    }

    if (!userPoolId) {
      throw new Error("The field userPoolId is required");
    }

    if (!region) {
      throw new Error("The field region is required");
    }

    if (typeof clientId !== "string" || typeof userPoolId !== "string" || typeof region !== "string") {
      throw new Error("The values to need be a string");
    }
  }

  /**
   * Confirm user in the cognito
   * @param {string} email
   */
  async #confirmUser(email){
    return this.cognito.adminConfirmSignUp({
      UserPoolId: this.#userPoolId,
      Username: email,
    }).promise();
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
    
    
    await this.#confirmUser(dataUser.email)

    if (response.UserSub) {
      return true;
    }

    return false;
  }
}
