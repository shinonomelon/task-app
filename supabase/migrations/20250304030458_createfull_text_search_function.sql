CREATE INDEX pgroonga_index_tags_name ON public.tags USING pgroonga (name) WITH (tokenizer='TokenBigram');

CREATE INDEX pgroonga_index_tasks_description ON public.tasks USING pgroonga (description) WITH (tokenizer='TokenBigram');

CREATE INDEX pgroonga_index_tasks_title ON public.tasks USING pgroonga (title) WITH (tokenizer='TokenBigram');

set check_function_bodies = off;

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
$function$
;

create type "public"."search_result" as ("tasks" search_task[], "tags" search_tag[]);

create type "public"."search_tag" as ("id" text, "name" text);

create type "public"."search_task" as ("id" text, "title" text);


