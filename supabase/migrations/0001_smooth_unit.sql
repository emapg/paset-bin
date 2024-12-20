/*
  # Initial Pastebin Schema Setup

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
    - `pastes`
      - Stores paste content and metadata
      - Links to profiles for user-created pastes
    - `paste_views`
      - Tracks view counts for pastes
    - `reports`
      - Stores content reports from users

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access control
    - Set up proper relationships between tables
*/

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

-- Create pastes table
CREATE TABLE pastes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'plain' NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true NOT NULL,
  custom_url TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT custom_url_length CHECK (char_length(custom_url) >= 3 AND char_length(custom_url) <= 50)
);

-- Create paste_views table
CREATE TABLE paste_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paste_id UUID REFERENCES pastes(id) ON DELETE CASCADE NOT NULL,
  viewer_ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paste_id UUID REFERENCES pastes(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed'))
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastes ENABLE ROW LEVEL SECURITY;
ALTER TABLE paste_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Pastes policies
CREATE POLICY "Public pastes are viewable by everyone"
  ON pastes FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create pastes"
  ON pastes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pastes"
  ON pastes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pastes"
  ON pastes FOR DELETE
  USING (auth.uid() = user_id);

-- Paste views policies
CREATE POLICY "Anyone can create paste views"
  ON paste_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Paste owners can view paste statistics"
  ON paste_views FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pastes
    WHERE pastes.id = paste_views.paste_id
    AND pastes.user_id = auth.uid()
  ));

-- Reports policies
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (reporter_id = auth.uid());

-- Create indexes
CREATE INDEX pastes_user_id_idx ON pastes(user_id);
CREATE INDEX pastes_custom_url_idx ON pastes(custom_url);
CREATE INDEX paste_views_paste_id_idx ON paste_views(paste_id);
CREATE INDEX reports_paste_id_idx ON reports(paste_id);

-- Create functions
CREATE OR REPLACE FUNCTION increment_paste_view(paste_id UUID, viewer_ip TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO paste_views (paste_id, viewer_ip)
  VALUES (paste_id, viewer_ip)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;