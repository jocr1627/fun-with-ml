import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Model } from 'fun-with-ml-schema';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModelsTag } from './gql-tags';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  constructor(private apollo: Apollo) {}

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
