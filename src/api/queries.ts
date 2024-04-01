export const operationGetUser = `
  query GetUserLogin($where: user_providers_bool_exp) {
    logins: user_providers(where: $where) {
      userId
    }
  }
`;

export const operationInsertUser = `
  mutation CreateUser($object: users_insert_input = {}) {
    newUser: insert_users_one(object: $object) {
      id
      email
      name      
    }
  }

  mutation CreateUserLogin($object: user_providers_insert_input = {}) {
    newUserLogin: insert_user_providers_one(object: $object) {
      id
      userId
      providerId
    }
  }
`;
