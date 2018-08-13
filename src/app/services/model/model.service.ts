import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { CreateModelInput, Model } from 'fun-with-ml-schema';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypedFetchResult } from '../typed-fetch-result';
import { CreateModelTag, ModelsTag } from './gql-tags';

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
}