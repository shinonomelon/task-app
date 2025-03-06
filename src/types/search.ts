import { Database } from './supabase/database';

type NonNullableProperties<T> = T extends (infer U)[]
  ? NonNullableProperties<U>[]
  : { [K in keyof T]: NonNullable<T[K]> };

export type SearchResult = {
  tasks: SearchTasksResult;
  tags: SearchTagsResult;
};

type SearchTasksResult = NonNullableProperties<
  NonNullable<Database['public']['CompositeTypes']['search_result']['tasks']>
>;

type SearchTagsResult = NonNullableProperties<
  NonNullable<Database['public']['CompositeTypes']['search_result']['tags']>
>;
