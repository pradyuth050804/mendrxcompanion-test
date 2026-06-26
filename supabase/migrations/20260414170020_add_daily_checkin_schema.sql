/*
  # Daily Check-in Schema Extension

  ## Summary
  Adds tables and columns to support the new daily check-in dashboard flow including:
  - Symptoms tracking (bloating, energy, mood, acidity) with 0-10 scale
  - Gut health tracking (Bristol Stool Chart type, frequency, ease)
  - Lifestyle tracking (sleep quality, stress level, activity)
  - Check-in sessions to track completion streaks

  ## New Tables
  1. `checkin_sessions` - Tracks each daily check-in with step completion status and streak
  2. `symptom_logs` - Stores symptom slider values per check-in
  3. `gut_logs` - Stores Bristol Stool Chart selection, frequency, ease
  4. `lifestyle_logs` - Stores sleep quality, stress, activity data

  ## Modified Tables
  - `daily_logs` extended with gut health and lifestyle fields via new separate tables

  ## Security
  - RLS enabled on all new tables
  - Authenticated users can only access their own data
*/

-- Checkin sessions table to track completion and streaks
CREATE TABLE IF NOT EXISTS checkin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  symptoms_done boolean DEFAULT false,
  gut_done boolean DEFAULT false,
  meals_done boolean DEFAULT false,
  lifestyle_done boolean DEFAULT false,
  is_complete boolean DEFAULT false,
  streak_count integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, session_date)
);

ALTER TABLE checkin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own checkin sessions"
  ON checkin_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkin sessions"
  ON checkin_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkin sessions"
  ON checkin_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Symptom logs table
CREATE TABLE IF NOT EXISTS symptom_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  bloating integer DEFAULT 0 CHECK (bloating >= 0 AND bloating <= 10),
  energy integer DEFAULT 5 CHECK (energy >= 0 AND energy <= 10),
  mood integer DEFAULT 5 CHECK (mood >= 0 AND mood <= 10),
  acidity integer DEFAULT 0 CHECK (acidity >= 0 AND acidity <= 10),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own symptom logs"
  ON symptom_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom logs"
  ON symptom_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptom logs"
  ON symptom_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Gut health logs table
CREATE TABLE IF NOT EXISTS gut_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  stool_type integer DEFAULT 4 CHECK (stool_type >= 1 AND stool_type <= 7),
  frequency integer DEFAULT 1 CHECK (frequency >= 0 AND frequency <= 10),
  ease text DEFAULT 'easy' CHECK (ease IN ('easy', 'strain', 'not_today')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE gut_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own gut logs"
  ON gut_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gut logs"
  ON gut_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gut logs"
  ON gut_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Lifestyle logs table
CREATE TABLE IF NOT EXISTS lifestyle_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  sleep_quality integer DEFAULT 5 CHECK (sleep_quality >= 0 AND sleep_quality <= 10),
  stress_level integer DEFAULT 5 CHECK (stress_level >= 0 AND stress_level <= 10),
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE lifestyle_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own lifestyle logs"
  ON lifestyle_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lifestyle logs"
  ON lifestyle_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lifestyle logs"
  ON lifestyle_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_checkin_sessions_user_date ON checkin_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_date ON symptom_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_gut_logs_user_date ON gut_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_lifestyle_logs_user_date ON lifestyle_logs(user_id, log_date);
