[![Pipeline Workflow](https://github.com/JeffersonGibin/visor-account-lmb-api/actions/workflows/pipeline.yml/badge.svg)](https://github.com/JeffersonGibin/visor-account-lmb-api/actions/workflows/pipeline.yml)


# Visor Account Lambda API

## What is this project ?

This service is part of the project for the selective process of the visor. The project is a service to create an account in the AWS Cognito.

![image](https://user-images.githubusercontent.com/6215779/226136395-18577d35-db92-4001-97da-3fedc2e0ea69.png)


### Pipeline Flow

![image](https://user-images.githubusercontent.com/6215779/226136779-4da23e37-5e9c-45d4-9856-58889906a188.png)

## How start the project in the localhost?

To execute docker-compose local using Cognito you need environments variables in the your System Operacional but this is not a proposity the
project. The proposity is delivery of the project deployed in the cloud.

```shell
export AWS_COGNITO_REGION=us-east-1
export AWS_COGNITO_CLIENT_ID=
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=

```



## Tecnologies

- serverless
- express
- jest
- docker
