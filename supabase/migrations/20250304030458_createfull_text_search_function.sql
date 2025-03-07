CREATE TYPE public.search_task AS (
  id text,
  title text
);

CREATE TYPE public.search_tag AS (
  id text,
  name text
);

CREATE TYPE public.search_result AS (
  tasks search_task[],
  tags search_tag[]
);

CREATE OR REPLACE FUNCTION public.full_text_search(query text)
 RETURNS search_result
 LANGUAGE plpgsql
AS $function$
DECLARE
  result search_result;
BEGIN
  SELECT COALESCE(
           array_agg((t.id::text, t.title)::search_task),
           ARRAY[]::search_task[]
         )
    INTO result.tasks
  FROM tasks t
  WHERE t.title &@~ query OR t.description &@~ query;

  SELECT COALESCE(
           array_agg((tg.id::text, tg.name)::search_tag),
           ARRAY[]::search_tag[]
         )
    INTO result.tags
  FROM tags tg
  WHERE tg.name &@~ query;

  RETURN result;
END;
$function$;


CREATE INDEX pgroonga_index_tags_name
  ON public.tags USING pgroonga (name)
  WITH (tokenizer='TokenBigram');

CREATE INDEX pgroonga_index_tasks_description
  ON public.tasks USING pgroonga (description)
  WITH (tokenizer='TokenBigram');

CREATE INDEX pgroonga_index_tasks_title
  ON public.tasks USING pgroonga (title)
  WITH (tokenizer='TokenBigram');
