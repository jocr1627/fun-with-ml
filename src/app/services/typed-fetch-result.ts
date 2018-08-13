import { FetchResult } from 'apollo-link';

export interface TypedFetchResult<T> extends FetchResult<any, any> {
  data: T;
}
