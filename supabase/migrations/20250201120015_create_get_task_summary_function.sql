drop function if exists "public"."get_task_counts"();

alter table "public"."tasks" alter column "completed" set not null;

alter table "public"."tasks" alter column "text" set not null;

alter table "public"."tasks" alter column "user_id" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_task_summary()
 RETURNS json
 LANGUAGE sql
AS $function$
WITH overall AS (
  SELECT 
    COUNT(*) AS total_task,
    COUNT(*) FILTER (WHERE completed = true) AS completed_task
  FROM tasks
),
today AS (
  SELECT 
    COUNT(*) AS total_task,
    COUNT(*) FILTER (WHERE completed = true) AS completed_task
  FROM tasks
  WHERE deadline::date = CURRENT_DATE
),
latest AS (
  SELECT 
    id, 
    text, 
    completed
  FROM tasks
  WHERE deadline::date = CURRENT_DATE
  ORDER BY completed DESC, id DESC
  LIMIT 5
)
SELECT json_build_object(
  'overall', (SELECT row_to_json(o) FROM overall o),
  'today', (
    SELECT json_build_object(
      'total_task', t.total_task,
      'completed_task', t.completed_task,
      'latest_task_list', (SELECT json_agg(l) FROM latest l)
    )
    FROM today t
  )
);
$function$
;


