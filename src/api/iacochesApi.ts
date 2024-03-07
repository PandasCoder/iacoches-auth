import axios from "axios";

export const iacochesGraphQL = async (
  operationsDoc: string,
  operationName: string,
  variables?: Record<string, any>,
  jwt?: string
) => {
  const config = {
    url: 'https://apidev.iacoches.ai/v1/graphql',
    method: 'post',
    data: {
      query: operationsDoc,
      variables,
      operationName,
    },
    headers: jwt ? { Authorization: 'Bearer ' + jwt } : {}
  };

  return axios(config)
    .then(result => result.data);
};
