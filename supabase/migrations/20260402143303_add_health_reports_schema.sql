/*
  # Health Reports Schema

  ## Overview
  Database schema for storing health lab reports with categorized health metrics
  for users in the MendRx Companion platform.

  ## Tables Created

  1. **health_reports**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `report_date` (date) - Date of the lab report
     - `report_name` (text) - Name/title of the report
     - `created_at` (timestamptz)

  2. **health_categories**
     - `id` (uuid, primary key)
     - `report_id` (uuid, foreign key)
     - `category_name` (text) - Metabolic Health, Inflammation, etc.
     - `status` (text) - good, needs_attention, at_risk
     - `icon_name` (text) - Icon identifier for the category
     - `summary` (text) - Brief summary of this category
     - `details` (jsonb) - Detailed metrics and values
     - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own reports
  - Authenticated users only

  ## Important Notes
  - Each report can have multiple health categories
  - Status values: good, needs_attention, at_risk
  - Categories: Metabolic Health, Inflammation, Nutrient Status, Liver Health, 
    Kidney Health, Gut Health, Hormonal Balance, Hematology
*/

-- Insert demo user if not exists
INSERT INTO users (id, phone_number, name, age)
VALUES ('00000000-0000-0000-0000-000000000001', '+919876543210', 'Priya Sharma', 32)
ON CONFLICT (id) DO NOTHING;

-- Create health_reports table
CREATE TABLE IF NOT EXISTS health_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  report_date date NOT NULL,
  report_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create health_categories table
CREATE TABLE IF NOT EXISTS health_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES health_reports(id) ON DELETE CASCADE,
  category_name text NOT NULL,
  status text NOT NULL DEFAULT 'good',
  icon_name text NOT NULL,
  summary text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('good', 'needs_attention', 'at_risk'))
);

-- Enable RLS
ALTER TABLE health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_reports
CREATE POLICY "Users can view own health reports"
  ON health_reports FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own health reports"
  ON health_reports FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for health_categories
CREATE POLICY "Users can view own health categories"
  ON health_categories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM health_reports
      WHERE health_reports.id = health_categories.report_id
      AND health_reports.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own health categories"
  ON health_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM health_reports
      WHERE health_reports.id = health_categories.report_id
      AND health_reports.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_reports_user_id ON health_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_health_reports_date ON health_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_health_categories_report_id ON health_categories(report_id);

-- Insert sample reports for demo user
INSERT INTO health_reports (user_id, report_date, report_name)
VALUES 
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '30 days', 'Monthly Health Checkup'),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '60 days', 'Initial Assessment'),
  ('00000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '90 days', 'Program Baseline')
ON CONFLICT DO NOTHING;

-- Insert sample health categories for the most recent report
DO $$
DECLARE
  recent_report_id uuid;
BEGIN
  SELECT id INTO recent_report_id 
  FROM health_reports 
  WHERE user_id = '00000000-0000-0000-0000-000000000001'
  ORDER BY report_date DESC 
  LIMIT 1;

  IF recent_report_id IS NOT NULL THEN
    INSERT INTO health_categories (report_id, category_name, status, icon_name, summary)
    VALUES 
      (recent_report_id, 'Metabolic Health', 'good', 'activity', 'Blood sugar and metabolism markers are within healthy range'),
      (recent_report_id, 'Inflammation', 'needs_attention', 'flame', 'Mild inflammation detected, monitor diet and stress'),
      (recent_report_id, 'Nutrient Status', 'needs_attention', 'apple', 'Iron and Vitamin D levels need improvement'),
      (recent_report_id, 'Liver Health', 'good', 'heart-pulse', 'Liver function tests are normal'),
      (recent_report_id, 'Kidney Health', 'good', 'droplet', 'Kidney markers are within optimal range'),
      (recent_report_id, 'Gut Health', 'at_risk', 'leaf', 'Digestive markers show signs of imbalance'),
      (recent_report_id, 'Hormonal Balance', 'needs_attention', 'zap', 'Thyroid levels improving but need monitoring'),
      (recent_report_id, 'Hematology', 'needs_attention', 'droplets', 'Hemoglobin levels are low, anemia treatment ongoing')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;