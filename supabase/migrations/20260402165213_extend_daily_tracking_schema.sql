/*
  # Extend Daily Tracking Schema

  ## Overview
  Adds water intake and weight tracking to existing daily_logs table.
  Creates new tables for partial meal tracking and supplement logging.

  ## Changes

  1. **daily_logs** - Add new columns
     - `water_intake` (integer) - Number of glasses consumed
     - `morning_weight` (decimal) - Optional morning weight in kg
     - `night_weight` (decimal) - Optional night weight in kg
     - `updated_at` (timestamptz) - Track last update time

  2. **partial_meal_logs** - New table
     - Track items missed from meal plans
     - Support for breakfast, lunch, dinner

  3. **supplement_logs** - New table
     - Track supplement adherence daily
     - Record what was taken or missed

  4. **suggested_supplements** - New table
     - Store user's prescribed supplements
     - Used to populate supplement tracking

  ## Security
  - RLS enabled on all new tables
  - Public access for demo purposes
*/

-- Add new columns to daily_logs if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_logs' AND column_name = 'water_intake'
  ) THEN
    ALTER TABLE daily_logs ADD COLUMN water_intake integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_logs' AND column_name = 'morning_weight'
  ) THEN
    ALTER TABLE daily_logs ADD COLUMN morning_weight decimal(5,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_logs' AND column_name = 'night_weight'
  ) THEN
    ALTER TABLE daily_logs ADD COLUMN night_weight decimal(5,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_logs' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE daily_logs ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create partial_meal_logs table
CREATE TABLE IF NOT EXISTS partial_meal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  meal_type text NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  items_missed text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_partial_meal_type CHECK (meal_type IN ('breakfast', 'lunch', 'dinner'))
);

-- Create supplement_logs table
CREATE TABLE IF NOT EXISTS supplement_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  supplement_name text NOT NULL,
  was_taken boolean DEFAULT true,
  time_of_day text NOT NULL DEFAULT 'morning',
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_supplement_time CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night'))
);

-- Create suggested_supplements table
CREATE TABLE IF NOT EXISTS suggested_supplements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  supplement_name text NOT NULL,
  dosage text,
  time_of_day text NOT NULL DEFAULT 'morning',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_suggested_supplement_time CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night'))
);

-- Enable RLS on new tables
ALTER TABLE partial_meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggested_supplements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partial_meal_logs
CREATE POLICY "Users can view own partial meal logs"
  ON partial_meal_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own partial meal logs"
  ON partial_meal_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can view partial meal logs"
  ON partial_meal_logs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert partial meal logs"
  ON partial_meal_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for supplement_logs
CREATE POLICY "Users can view own supplement logs"
  ON supplement_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own supplement logs"
  ON supplement_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can view supplement logs"
  ON supplement_logs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert supplement logs"
  ON supplement_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for suggested_supplements
CREATE POLICY "Users can view own suggested supplements"
  ON suggested_supplements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own suggested supplements"
  ON suggested_supplements FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can view suggested supplements"
  ON suggested_supplements FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can manage suggested supplements"
  ON suggested_supplements FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_partial_meal_logs_user_date ON partial_meal_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_supplement_logs_user_date ON supplement_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_suggested_supplements_user ON suggested_supplements(user_id, is_active);

-- Insert sample suggested supplements for demo
INSERT INTO suggested_supplements (user_id, supplement_name, dosage, time_of_day) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Vitamin D3', '2000 IU', 'morning'),
  ('00000000-0000-0000-0000-000000000001', 'Omega-3', '1000mg', 'morning'),
  ('00000000-0000-0000-0000-000000000001', 'Magnesium', '400mg', 'evening'),
  ('00000000-0000-0000-0000-000000000001', 'Zinc', '15mg', 'evening'),
  ('00000000-0000-0000-0000-000000000001', 'B-Complex', '1 tablet', 'morning'),
  ('00000000-0000-0000-0000-000000000001', 'Probiotics', '10 billion CFU', 'morning')
ON CONFLICT DO NOTHING;