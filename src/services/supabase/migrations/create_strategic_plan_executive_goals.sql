-- Create strategic_plan_executive_goals table
CREATE TABLE IF NOT EXISTS strategic_plan_executive_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategic_plan_id UUID NOT NULL REFERENCES strategic_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  owner TEXT,
  element TEXT,
  related_to TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_executive_goals_strategic_plan ON strategic_plan_executive_goals(strategic_plan_id);
CREATE INDEX IF NOT EXISTS idx_executive_goals_user ON strategic_plan_executive_goals(user_id);

-- Enable Row Level Security
ALTER TABLE strategic_plan_executive_goals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own executive goals" ON strategic_plan_executive_goals;
DROP POLICY IF EXISTS "Users can create their own executive goals" ON strategic_plan_executive_goals;
DROP POLICY IF EXISTS "Users can update their own executive goals" ON strategic_plan_executive_goals;
DROP POLICY IF EXISTS "Users can delete their own executive goals" ON strategic_plan_executive_goals;

-- Create RLS policies
CREATE POLICY "Users can view their own executive goals"
  ON strategic_plan_executive_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own executive goals"
  ON strategic_plan_executive_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own executive goals"
  ON strategic_plan_executive_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own executive goals"
  ON strategic_plan_executive_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_executive_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_executive_goals_timestamp
  BEFORE UPDATE ON strategic_plan_executive_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_executive_goals_updated_at();
