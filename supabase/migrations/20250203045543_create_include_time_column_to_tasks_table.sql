alter table "public"."tasks" add column "include_time" boolean not null default true;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_task_summary()
 RETURNS json
 LANGUAGE sql
AS $function$WITH overall AS (
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
  WHERE (deadline AT TIME ZONE 'Asia/Tokyo')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Tokyo')::date
),
latest AS (
  SELECT 
    id, 
    text, 
    completed,
    deadline,
    include_time
  FROM tasks
  WHERE (deadline AT TIME ZONE 'Asia/Tokyo')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Tokyo')::date
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
);$function$
;


