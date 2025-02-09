create table "public"."tags" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying(100) not null,
    "color" character varying(7) not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "user_id" uuid not null
);


alter table "public"."tags" enable row level security;

create table "public"."task_tags" (
    "task_id" uuid not null,
    "tag_id" uuid not null
);


alter table "public"."task_tags" enable row level security;

alter table "public"."tasks" add column "updated_at" timestamp with time zone not null default now();

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX task_tags_pkey ON public.task_tags USING btree (task_id, tag_id);

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."task_tags" add constraint "task_tags_pkey" PRIMARY KEY using index "task_tags_pkey";

alter table "public"."tags" add constraint "tags_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tags" validate constraint "tags_user_id_fkey";

alter table "public"."task_tags" add constraint "task_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE not valid;

alter table "public"."task_tags" validate constraint "task_tags_tag_id_fkey";

alter table "public"."task_tags" add constraint "task_tags_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE not valid;

alter table "public"."task_tags" validate constraint "task_tags_task_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

grant delete on table "public"."task_tags" to "anon";

grant insert on table "public"."task_tags" to "anon";

grant references on table "public"."task_tags" to "anon";

grant select on table "public"."task_tags" to "anon";

grant trigger on table "public"."task_tags" to "anon";

grant truncate on table "public"."task_tags" to "anon";

grant update on table "public"."task_tags" to "anon";

grant delete on table "public"."task_tags" to "authenticated";

grant insert on table "public"."task_tags" to "authenticated";

grant references on table "public"."task_tags" to "authenticated";

grant select on table "public"."task_tags" to "authenticated";

grant trigger on table "public"."task_tags" to "authenticated";

grant truncate on table "public"."task_tags" to "authenticated";

grant update on table "public"."task_tags" to "authenticated";

grant delete on table "public"."task_tags" to "service_role";

grant insert on table "public"."task_tags" to "service_role";

grant references on table "public"."task_tags" to "service_role";

grant select on table "public"."task_tags" to "service_role";

grant trigger on table "public"."task_tags" to "service_role";

grant truncate on table "public"."task_tags" to "service_role";

grant update on table "public"."task_tags" to "service_role";

create policy "Enable all command for users based on user_id"
on "public"."tags"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable all command for authenticated users only"
on "public"."task_tags"
as permissive
for all
to authenticated
using (true)
with check (true);


CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

