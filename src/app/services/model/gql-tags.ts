import gql from 'graphql-tag';

export const CreateModelTag = gql(`
  mutation CreateModel($input: CreateModelInput!) {
    createModel(input: $input) {
      id
      name
      urls
    }
  }
`);

export const ModelsTag = gql(`
  query Models {
    models {
      id
      name
      urls
    }
  }
`);
