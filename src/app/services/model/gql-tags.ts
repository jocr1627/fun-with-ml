import gql from 'graphql-tag';

export const ModelsTag = gql(`
  query Models {
    models {
      id
      name
      urls
    }
  }
`);
