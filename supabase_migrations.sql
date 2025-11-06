-- =====================================================
-- STRATEGY365 DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. STRATEGIES TABLE (Main Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  strategic_details TEXT,
  vision_mission TEXT,
  focus_areas TEXT,
  is_draft BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_strategies_user_id ON strategies(user_id);
CREATE INDEX idx_strategies_created_at ON strategies(created_at DESC);

-- =====================================================
-- 2. STRATEGIC GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS strategic_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  element VARCHAR(255) NOT NULL,
  description TEXT,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_strategic_goals_strategy_id ON strategic_goals(strategy_id);

-- =====================================================
-- 3. OPERATIONAL GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS operational_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  element VARCHAR(255) NOT NULL,
  description TEXT,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_operational_goals_strategy_id ON operational_goals(strategy_id);

-- =====================================================
-- 4. STRATEGY VALUES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS strategy_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_strategy_values_strategy_id ON strategy_values(strategy_id);

-- =====================================================
-- 5. STRATEGY PILLARS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS strategy_pillars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_strategy_pillars_strategy_id ON strategy_pillars(strategy_id);

-- =====================================================
-- 6. STRATEGY ATTACHMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS strategy_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_strategy_attachments_strategy_id ON strategy_attachments(strategy_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to strategies table
CREATE TRIGGER update_strategies_updated_at
  BEFORE UPDATE ON strategies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to strategic_goals table
CREATE TRIGGER update_strategic_goals_updated_at
  BEFORE UPDATE ON strategic_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to operational_goals table
CREATE TRIGGER update_operational_goals_updated_at
  BEFORE UPDATE ON operational_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to strategy_values table
CREATE TRIGGER update_strategy_values_updated_at
  BEFORE UPDATE ON strategy_values
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to strategy_pillars table
CREATE TRIGGER update_strategy_pillars_updated_at
  BEFORE UPDATE ON strategy_pillars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_attachments ENABLE ROW LEVEL SECURITY;

-- Strategies policies
CREATE POLICY "Users can view their own strategies"
  ON strategies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own strategies"
  ON strategies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategies"
  ON strategies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategies"
  ON strategies FOR DELETE
  USING (auth.uid() = user_id);

-- Strategic goals policies
CREATE POLICY "Users can view strategic goals of their strategies"
  ON strategic_goals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategic_goals.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert strategic goals to their strategies"
  ON strategic_goals FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategic_goals.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can update strategic goals of their strategies"
  ON strategic_goals FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategic_goals.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete strategic goals of their strategies"
  ON strategic_goals FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategic_goals.strategy_id
    AND strategies.user_id = auth.uid()
  ));

-- Operational goals policies (same pattern)
CREATE POLICY "Users can view operational goals of their strategies"
  ON operational_goals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = operational_goals.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert operational goals to their strategies"
  ON operational_goals FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = operational_goals.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can update operational goals of their strategies"
  ON operational_goals FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = operational_goals.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete operational goals of their strategies"
  ON operational_goals FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = operational_goals.strategy_id
    AND strategies.user_id = auth.uid()
  ));

-- Values policies (same pattern)
CREATE POLICY "Users can view values of their strategies"
  ON strategy_values FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_values.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert values to their strategies"
  ON strategy_values FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_values.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can update values of their strategies"
  ON strategy_values FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_values.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete values of their strategies"
  ON strategy_values FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_values.strategy_id
    AND strategies.user_id = auth.uid()
  ));

-- Pillars policies (same pattern)
CREATE POLICY "Users can view pillars of their strategies"
  ON strategy_pillars FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_pillars.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert pillars to their strategies"
  ON strategy_pillars FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_pillars.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can update pillars of their strategies"
  ON strategy_pillars FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_pillars.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete pillars of their strategies"
  ON strategy_pillars FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_pillars.strategy_id
    AND strategies.user_id = auth.uid()
  ));

-- Attachments policies (same pattern)
CREATE POLICY "Users can view attachments of their strategies"
  ON strategy_attachments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_attachments.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert attachments to their strategies"
  ON strategy_attachments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_attachments.strategy_id
    AND strategies.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete attachments of their strategies"
  ON strategy_attachments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_attachments.strategy_id
    AND strategies.user_id = auth.uid()
  ));

-- =====================================================
-- STORAGE BUCKET FOR ATTACHMENTS
-- =====================================================
-- Note: Run this in Supabase Dashboard > Storage
-- 
-- 1. Create bucket named: strategy-attachments
-- 2. Set as public or private based on your needs
-- 3. Add storage policies:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('strategy-attachments', 'strategy-attachments', false);
--
-- CREATE POLICY "Users can upload their strategy attachments"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'strategy-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can view their strategy attachments"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'strategy-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
--
-- CREATE POLICY "Users can delete their strategy attachments"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'strategy-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
