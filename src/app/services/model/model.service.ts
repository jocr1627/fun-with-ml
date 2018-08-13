import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import {
  CreateModelInput,
  GenerateJob,
  GenerateTextFromModelInput,
  Model,
  ModelInput,
  TrainingJob,
  TrainModelInput
} from 'fun-with-ml-schema';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypedFetchResult } from '../typed-fetch-result';
import {
  CreateModelTag,
  GenerateJobTag,
  GenerateTextFromModelTag,
  ModelTag,
  ModelsTag,
  TrainingJobTag,
  TrainModelTag
} from './gql-tags';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  constructor(private apollo: Apollo) {}

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
          const { models } = data as any;

          return { ...result, data: models };
        })
      );
  }

  public generateTextFromModel(
    input: GenerateTextFromModelInput
  ): Observable<ApolloQueryResult<GenerateJob>> {
    const queryRef = this.apollo.watchQuery({
      query: GenerateJobTag,
      variables: { input: { id: input.id } }
    });

    queryRef.subscribeToMore({
      document: GenerateTextFromModelTag,
      variables: { input },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const generateJob = subscriptionData.data.generateTextFromModel;

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

  public trainModel(
    input: TrainModelInput
  ): Observable<ApolloQueryResult<TrainingJob>> {
    const queryRef = this.apollo.watchQuery({
      query: TrainingJobTag,
      variables: { input: { id: input.id } }
    });

    queryRef.subscribeToMore({
      document: TrainModelTag,
      variables: { input },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const trainingJob = subscriptionData.data.trainModel;

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
}
