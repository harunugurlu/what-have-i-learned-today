-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create colors table
CREATE TABLE IF NOT EXISTS colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  hex_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create learning_logs table
CREATE TABLE IF NOT EXISTS learning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  color_id UUID NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create learning_log_tags table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS learning_log_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_log_id UUID NOT NULL REFERENCES learning_logs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(learning_log_id, tag_id)
);

-- Insert default colors
INSERT INTO colors (name, hex_code) VALUES
  ('Blue', '#3B82F6'),
  ('Green', '#10B981'),
  ('Red', '#EF4444'),
  ('Yellow', '#F59E0B'),
  ('Purple', '#8B5CF6'),
  ('Pink', '#EC4899'),
  ('Indigo', '#6366F1'),
  ('Teal', '#14B8A6'),
  ('Orange', '#F97316'),
  ('Cyan', '#06B6D4')
ON CONFLICT (name) DO NOTHING;

-- Create RLS policies
-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Colors table policies
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view colors"
  ON colors FOR SELECT
  USING (true);

-- Tags table policies
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Learning logs table policies
ALTER TABLE learning_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning logs"
  ON learning_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning logs"
  ON learning_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning logs"
  ON learning_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning logs"
  ON learning_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Learning log tags table policies
ALTER TABLE learning_log_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning log tags"
  ON learning_log_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM learning_logs
    WHERE learning_logs.id = learning_log_tags.learning_log_id
    AND learning_logs.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own learning log tags"
  ON learning_log_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM learning_logs
    WHERE learning_logs.id = learning_log_tags.learning_log_id
    AND learning_logs.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own learning log tags"
  ON learning_log_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM learning_logs
    WHERE learning_logs.id = learning_log_tags.learning_log_id
    AND learning_logs.user_id = auth.uid()
  )); 