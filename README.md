[![Pipeline Workflow](https://github.com/JeffersonGibin/visor-account-lmb-api/actions/workflows/pipeline.yml/badge.svg)](https://github.com/JeffersonGibin/visor-account-lmb-api/actions/workflows/pipeline.yml)


# Visor Account Lambda API

## What is this project ?

This service is part of the project for the selective process of the visor. The project is a service to create an account in the AWS Cognito.For more information about the project, [visit here](https://github.com/JeffersonGibin/visor-challenge)


![image](https://user-images.githubusercontent.com/6215779/226136779-4da23e37-5e9c-45d4-9856-58889906a188.png)


### Pipeline Flow
![image](https://user-images.githubusercontent.com/6215779/226136793-39ed132b-cde8-4467-a091-dd3922721010.png)


## How start the project in the localhost?

To execute docker-compose local using Cognito you need environments variables in the your System Operacional but this is not a proposity the
project. The proposity is delivery of the project deployed in the cloud.

```shell
# Credentials Gateway
export AWS_API_GATEWAY_ID=
export AWS_API_GATEWAY_RESOURCE_ID=

# Credentials Cognito
export AWS_COGNITO_CLIENT_ID=
export AWS_COGNITO_POOL_ID=
export AWS_COGNITO_REGION=us-east-1

# Credentials with access programatic
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=

```

**Note: Don't necessay confirm the user. The flow is forced when the user is created.**

## Routes

The 'endpoint' access local is `http://localhost:3000/dev/`

| Context        | Resource   | Use Case             | parameters body                                         |
| -------------- | ---------- | -------------------- | ------------------------------------------------------- |
| Account | `/sign-up` | `POST /account/sign-up` | `{'name': 'Josh', 'email": "email@exemple.com", "password": "123456k"}` |

## Tecnologies

- serverless
- javascript
- express
- jest
- docker
