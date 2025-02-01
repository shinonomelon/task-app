CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
ALTER TABLE tasks DROP COLUMN priority;
ALTER TABLE tasks ADD COLUMN priority priority_level NOT NULL DEFAULT 'low';
