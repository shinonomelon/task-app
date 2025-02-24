CREATE OR REPLACE FUNCTION public.edit_task(p_task_id uuid, p_user_id uuid, p_title text, p_description text, p_deadline text, p_include_time boolean, p_priority text, p_completed boolean, p_tag_ids uuid[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  existing_tags uuid[];
  tags_to_add uuid[];
  tags_to_remove uuid[];
BEGIN
  UPDATE tasks
  SET 
    title = p_title,
    description = p_description,
    deadline = (CASE WHEN p_deadline IS NULL OR p_deadline = '' THEN NULL ELSE p_deadline::timestamptz END),
    priority = p_priority::priority_level,
    completed = p_completed
  WHERE id = p_task_id AND user_id = p_user_id;

  SELECT array_agg(tag_id)
  INTO existing_tags
  FROM task_tags
  WHERE task_id = p_task_id;

  existing_tags := COALESCE(existing_tags, '{}');

  SELECT array_agg(t) INTO tags_to_add
  FROM unnest(p_tag_ids) AS t
  WHERE NOT t = ANY(existing_tags);

  SELECT array_agg(t) INTO tags_to_remove
  FROM unnest(existing_tags) AS t
  WHERE NOT t = ANY(p_tag_ids);

  IF tags_to_remove IS NOT NULL THEN
    DELETE FROM task_tags
    WHERE task_id = p_task_id AND tag_id = ANY(tags_to_remove);
  END IF;

  IF tags_to_add IS NOT NULL THEN
    INSERT INTO task_tags (task_id, tag_id)
    SELECT p_task_id, t
    FROM unnest(tags_to_add) AS t;
  END IF;
END;
$function$
;


