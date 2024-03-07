import { LOGIN_PROVIDERS } from "../domain/login-providers.enum";
import { iacochesGraphQL } from "./iacochesApi";
import { operationGetUser, operationInsertUser } from "./queries";

export interface RequestError {
  response: {
    status: number;
  },
  title: string,
  message: string
}

interface GetByProvider {
  loginProviderId: LOGIN_PROVIDERS,
  providerId?: string,
  email?: string
}

export const getError = ({ title, message, response }: RequestError): RequestError => ({ title, message, response })

const getUserByProvider = async ({
  loginProviderId, 
  providerId, 
  email
}: GetByProvider): Promise<any> => {
  const strategyFields = loginProviderId === LOGIN_PROVIDERS.LOCAL ? {
    "email": { "_eq": email }
  } : {
    "providerId": { "_eq": providerId },
  }

  const { data, errors } = await iacochesGraphQL(
    operationGetUser,
    'GetUserLogin',
    {
      "where": {
        "loginProviderId": { "_eq": loginProviderId },
        ...strategyFields
      }
    }
  )

  if (errors) {
    throw getError(errors as RequestError)
  }

  return data.logins[0];
}

const getUserLoginByEmail = async (email: string): Promise<any> => {
  try {
    const { data } = await iacochesGraphQL(
      operationGetUser,
      'GetUserLogin',
      {
        "where": {
          "email": { "_eq": email }
        }
      }
    )

    return data.logins[0];
  } catch (error) {
    throw getError(error as RequestError)
  }
}

const createUser = async (object: any): Promise<any> => {
  try {
    const { data, errors } = await iacochesGraphQL(
      operationInsertUser,
      'CreateUser',
      {
        "object": object
      }
    )

    if (errors) {
      return errors[0];
    }

    return data.newUser;
  } catch (error) {
    throw getError(error as RequestError)
  }
}

const createUserLogin = async (object: any): Promise<any> => {
  try {
    const { data, errors } = await iacochesGraphQL(
      operationInsertUser,
      'CreateUserLogin',
      {
        "object": object
      }
    )

    return data.newUserLogin;
  } catch (error) {
    throw getError(error as RequestError)
  }
}


export const GeneralEndpoints = {
  getUserByProvider,
  getUserLoginByEmail,
  createUser,
  createUserLogin
}