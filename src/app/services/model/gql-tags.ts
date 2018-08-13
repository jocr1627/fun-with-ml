import gql from 'graphql-tag';

export const BatchCompletedTag = gql(`
  subscription BatchCompleted {
    batchCompleted {
      batch
      epoch
      errors
      id
      loss
      status
    }
  }
`);

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
      errors
      id
      status
      text
    }
  }
`);

export const GenerateTextFromModelTag = gql(`
  mutation GenerateTextFromModel($input: GenerateTextFromModelInput!) {
    generateTextFromModel(input: $input) {
      errors
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

export const TextGeneratedTag = gql(`
  subscription TextGenerated {
    textGenerated {
      id
      status
      text
    }
  }
`);

export const TrainingJobTag = gql(`
  query TrainingJob($input: TrainingJobInput!) {
    trainingJob(input: $input) {
      batch
      epoch
      errors
      id
      loss
      status
    }
  }
`);

export const TrainModelTag = gql(`
  mutation TrainModel($input: TrainModelInput!) {
    trainModel(input: $input) {
      batch
      epoch
      errors
      id
      loss
      status
    }
  }
`);
