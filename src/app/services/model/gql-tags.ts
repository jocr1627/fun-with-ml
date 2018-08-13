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

export const ModelTag = gql(`
  query Model($input: ModelInput!) {
    model(input: $input) {
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

export const TrainingJobTag = gql(`
  query TrainingJob($input: TrainingJobInput!) {
    trainingJob(input: $input) {
      batch
      epoch
      id
      loss
    }
  }
`);

export const TrainModelTag = gql(`
  subscription TrainModel($input: TrainModelInput!) {
    trainModel(input: $input) {
      batch
      epoch
      id
      loss
    }
  }
`);
