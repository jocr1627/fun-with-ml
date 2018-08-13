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

export const GenerateJobTag = gql(`
  query GenerateJob($input: GenerateJobInput!) {
    generateJob(input: $input) {
      id
      status
      text
    }
  }
`);

export const GenerateTextFromModelTag = gql(`
  subscription GenerateTextFromModel($input: GenerateTextFromModelInput!) {
    generateTextFromModel(input: $input) {
      id
      status
      text
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
      status
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
      status
    }
  }
`);
