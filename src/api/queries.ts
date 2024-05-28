export const operationGetUser = `
  query GetUserLogin($where: user_providers_bool_exp) {
    logins: user_providers(where: $where) {
      id
      userId
      email
      providerId
      loginProviderId
      user {
        id
        email
        name
      }
      loginProvider {
        id
        provider
      }
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

export const operationInsertUserMembership = `
  mutation CreateUserMembership($object: memberships_insert_input = {}) {
    newMembership: insert_memberships_one(object: $object) {
      id
    }
  }
`;
