CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

WITH credentials(id, email, pass) AS (
  VALUES ('123e4567-e89b-12d3-a456-426614174000', 'test@example.com', 'password123456')
),
create_user AS (
  INSERT INTO auth.users (id, instance_id, role, aud, email, raw_app_meta_data, raw_user_meta_data, is_super_admin, encrypted_password, created_at, updated_at, last_sign_in_at, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  SELECT id::uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', email, '{"provider":"email","providers":["email"]}', '{}', FALSE, crypt(pass, gen_salt('bf')), NOW(), NOW(), NOW(), NOW(), NOW(), '', '', '', '' FROM credentials
  RETURNING id
)
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), id, id, json_build_object('sub', id), 'email', NOW(), NOW(), NOW() FROM create_user;


INSERT INTO public.tasks (id, text, completed, user_id, deadline, priority, include_time, created_at)
VALUES
  (uuid_generate_v4(), 'レポートの作成', false, '123e4567-e89b-12d3-a456-426614174000', '2025-02-10 12:00:00+09', 'high', true, NOW()),
  (uuid_generate_v4(), '講義の予習・復習', true, '123e4567-e89b-12d3-a456-426614174000', '2025-02-14 15:00:00+09', 'low', false, NOW()),
  (uuid_generate_v4(), 'プログラミング', true, '123e4567-e89b-12d3-a456-426614174000', '2025-02-15 15:00:00+09', 'medium', false, NOW()),
  (uuid_generate_v4(), '面接', false, '123e4567-e89b-12d3-a456-426614174000', '2025-02-20 09:00:00+09', 'high', true, NOW());
