/*
  # Health Tracking Platform Schema

  ## Overview
  Database schema for a functional medicine health platform tracking daily adherence,
  symptoms, meals, supplements, and progress for patients enrolled in 3-month programs.

  ## Tables Created

  1. **users**
     - `id` (uuid, primary key)
     - `phone_number` (text, unique)
     - `name` (text)
     - `age` (integer)
     - `practitioner_code` (text)
     - `subscription_status` (text) - active, paused, expired
     - `program_start_date` (date)
     - `program_end_date` (date)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  2. **health_conditions**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `condition_name` (text) - thyroid, anemia, gut_issues, etc.
     - `goal` (text) - improve energy, weight gain, etc.
     - `created_at` (timestamptz)

  3. **diet_plans**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `meal_type` (text) - breakfast, lunch, dinner, snack
     - `meal_description` (text)
     - `timing` (text)
     - `is_active` (boolean)
     - `created_at` (timestamptz)

  4. **supplements**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `name` (text)
     - `dosage` (text)
     - `timing` (text) - morning, afternoon, night, after_meal
     - `is_active` (boolean)
     - `created_at` (timestamptz)

  5. **lifestyle_plans**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `activity` (text) - sunlight, walking, sleep
     - `duration` (text)
     - `timing` (text)
     - `is_active` (boolean)
     - `created_at` (timestamptz)

  6. **daily_logs**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `log_date` (date)
     - `meals_followed` (text) - yes, partial, no
     - `supplements_taken` (boolean)
     - `energy_level` (integer) - 1-5
     - `symptoms` (jsonb) - array of symptoms
     - `sleep_hours` (integer)
     - `notes` (text)
     - `created_at` (timestamptz)

  7. **daily_scores**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `score_date` (date)
     - `adherence_score` (integer) - 0-100
     - `energy_trend` (text) - up, down, stable
     - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users only
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer,
  practitioner_code text,
  subscription_status text DEFAULT 'active',
  program_start_date date DEFAULT CURRENT_DATE,
  program_end_date date DEFAULT CURRENT_DATE + INTERVAL '90 days',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create health_conditions table
CREATE TABLE IF NOT EXISTS health_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  condition_name text NOT NULL,
  goal text,
  created_at timestamptz DEFAULT now()
);

-- Create diet_plans table
CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  meal_type text NOT NULL,
  meal_description text NOT NULL,
  timing text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create supplements table
CREATE TABLE IF NOT EXISTS supplements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  timing text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create lifestyle_plans table
CREATE TABLE IF NOT EXISTS lifestyle_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity text NOT NULL,
  duration text,
  timing text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  meals_followed text DEFAULT 'no',
  supplements_taken boolean DEFAULT false,
  energy_level integer DEFAULT 3,
  symptoms jsonb DEFAULT '[]'::jsonb,
  sleep_hours integer DEFAULT 7,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);

-- Create daily_scores table
CREATE TABLE IF NOT EXISTS daily_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  score_date date NOT NULL DEFAULT CURRENT_DATE,
  adherence_score integer DEFAULT 0,
  energy_trend text DEFAULT 'stable',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, score_date)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifestyle_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for health_conditions
CREATE POLICY "Users can view own health conditions"
  ON health_conditions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own health conditions"
  ON health_conditions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for diet_plans
CREATE POLICY "Users can view own diet plans"
  ON diet_plans FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for supplements
CREATE POLICY "Users can view own supplements"
  ON supplements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for lifestyle_plans
CREATE POLICY "Users can view own lifestyle plans"
  ON lifestyle_plans FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for daily_logs
CREATE POLICY "Users can view own daily logs"
  ON daily_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own daily logs"
  ON daily_logs FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for daily_scores
CREATE POLICY "Users can view own daily scores"
  ON daily_scores FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own daily scores"
  ON daily_scores FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_conditions_user_id ON health_conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_user_id ON diet_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_supplements_user_id ON supplements(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_plans_user_id ON lifestyle_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_id ON daily_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_scores_date ON daily_scores(score_date);