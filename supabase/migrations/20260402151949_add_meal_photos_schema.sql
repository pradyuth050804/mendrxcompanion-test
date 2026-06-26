/*
  # Meal Photos Schema

  ## Overview
  Database schema for storing meal photos and related information (homemade vs outside)
  for tracking user's daily meal adherence with visual evidence.

  ## Tables Created

  1. **meal_photos**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `meal_type` (text) - breakfast, lunch, dinner
     - `photo_url` (text) - URL or base64 of the photo
     - `meal_source` (text) - homemade, outside
     - `meal_date` (date) - Date of the meal
     - `notes` (text) - Optional notes
     - `created_at` (timestamptz)

  ## Security
  - Enable RLS on the table
  - Users can only access their own meal photos
  - Authenticated users can insert, update, and delete their photos

  ## Important Notes
  - meal_type values: breakfast, lunch, dinner
  - meal_source values: homemade, outside
  - photo_url can store base64 encoded images for demo purposes
*/

-- Create meal_photos table
CREATE TABLE IF NOT EXISTS meal_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  meal_type text NOT NULL,
  photo_url text NOT NULL,
  meal_source text NOT NULL DEFAULT 'homemade',
  meal_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_meal_type CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  CONSTRAINT valid_meal_source CHECK (meal_source IN ('homemade', 'outside'))
);

-- Enable RLS
ALTER TABLE meal_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meal_photos
CREATE POLICY "Users can view own meal photos"
  ON meal_photos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own meal photos"
  ON meal_photos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own meal photos"
  ON meal_photos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own meal photos"
  ON meal_photos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Allow public access for demo
CREATE POLICY "Public can view meal photos"
  ON meal_photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert meal photos"
  ON meal_photos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meal_photos_user_id ON meal_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_photos_date ON meal_photos(meal_date);
CREATE INDEX IF NOT EXISTS idx_meal_photos_type ON meal_photos(meal_type);