import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import {
  CreateModelInput,
  GenerateJob,
  GenerateJobInput,
  GenerateTextFromModelInput,
  Model,
  ModelInput,
  TrainingJob,
  TrainingJobInput,
  TrainModelInput
} from 'fun-with-ml-schema';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypedFetchResult } from '../typed-fetch-result';
import {
  BatchCompletedTag,
  CreateModelTag,
  GenerateJobTag,
  GenerateTextFromModelTag,
  ModelTag,
  ModelsTag,
  TextGeneratedTag,
  TrainingJobTag,
  TrainModelTag
} from './gql-tags';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  constructor(private apollo: Apollo) {}

  public batchCompleted(
    input: TrainingJobInput
  ): Observable<ApolloQueryResult<TrainingJob>> {
    const queryRef = this.apollo.watchQuery({
      query: TrainingJobTag,
      variables: { input }
    });

    queryRef.subscribeToMore({
      document: BatchCompletedTag,
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          subscriptionData.data.batchCompleted.id !== input.id
        ) {
          return prev;
        }

        const trainingJob = subscriptionData.data.batchCompleted;

        return {
          trainingJob
        };
      }
    });

    return queryRef.valueChanges.pipe(
      map(result => {
        const { data } = result;
        const { trainingJob } = data as any;

        return { ...result, data: trainingJob };
      })
    );
  }

  public createModel(
    input: CreateModelInput
  ): Observable<TypedFetchResult<Model>> {
    return this.apollo
      .mutate({
        mutation: CreateModelTag,
        refetchQueries: [{ query: ModelsTag }],
        variables: { input }
      })
      .pipe(
        map(result => {
          const { data } = result;
          const { createModel } = data as any;

          return { ...result, data: createModel };
        })
      );
  }

  public generateTextFromModel(
    input: GenerateTextFromModelInput
  ): Observable<TypedFetchResult<GenerateJob>> {
    return this.apollo
      .mutate({
        mutation: GenerateTextFromModelTag,
        variables: { input }
      })
      .pipe(
        map(result => {
          const { data } = result;
          const { generateTextFromModel } = data as any;

          return { ...result, data: generateTextFromModel };
        })
      );
  }

  public model(input: ModelInput): Observable<ApolloQueryResult<Model>> {
    return this.apollo
      .watchQuery({
        query: ModelTag,
        variables: { input }
      })
      .valueChanges.pipe(
        map(result => {
          const { data } = result;
          const { model } = data as any;

          return { ...result, data: model };
        })
      );
  }

  public models(): Observable<ApolloQueryResult<Model[]>> {
    return this.apollo
      .watchQuery({
        query: ModelsTag
      })
      .valueChanges.pipe(
        map(result => {
          const { data } = result;
          const { models } = data as any;

          return { ...result, data: models };
        })
      );
  }

  public textGenerated(
    input: GenerateJobInput
  ): Observable<ApolloQueryResult<GenerateJob>> {
    const queryRef = this.apollo.watchQuery({
      query: GenerateJobTag,
      variables: { input }
    });

    queryRef.subscribeToMore({
      document: TextGeneratedTag,
      updateQuery: (prev, { subscriptionData }) => {
        if (
          !subscriptionData.data ||
          subscriptionData.data.textGenerated.id !== input.id
        ) {
          return prev;
        }

        const generateJob = subscriptionData.data.textGenerated;

        return {
          generateJob
        };
      }
    });

    return queryRef.valueChanges.pipe(
      map(result => {
        const { data } = result;
        const { generateJob } = data as any;

        return { ...result, data: generateJob };
      })
    );
  }

  public trainModel(
    input: TrainModelInput
  ): Observable<TypedFetchResult<TrainingJob>> {
    return this.apollo
      .mutate({
        mutation: TrainModelTag,
        refetchQueries: [
          { query: ModelTag, variables: { input: { id: input.id } } }
        ],
        variables: { input }
      })
      .pipe(
        map(result => {
          const { data } = result;
          const { trainModel } = data as any;

          return { ...result, data: trainModel };
        })
      );
  }
}
