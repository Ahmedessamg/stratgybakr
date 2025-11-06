-- =====================================================
-- STRATEGIC PLAN POLICIES TABLE
-- =====================================================

-- Create strategic_plan_policies table
CREATE TABLE IF NOT EXISTS strategic_plan_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategic_plan_id UUID NOT NULL REFERENCES strategic_plans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_strategic_plan_policies_plan_id ON strategic_plan_policies(strategic_plan_id);

-- Enable Row Level Security
ALTER TABLE strategic_plan_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access policies of their strategic plans
CREATE POLICY "Users can view policies of their strategic plans"
ON strategic_plan_policies FOR SELECT
USING (
  strategic_plan_id IN (
    SELECT id FROM strategic_plans WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert policies to their strategic plans"
ON strategic_plan_policies FOR INSERT
WITH CHECK (
  strategic_plan_id IN (
    SELECT id FROM strategic_plans WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update policies of their strategic plans"
ON strategic_plan_policies FOR UPDATE
USING (
  strategic_plan_id IN (
    SELECT id FROM strategic_plans WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete policies of their strategic plans"
ON strategic_plan_policies FOR DELETE
USING (
  strategic_plan_id IN (
    SELECT id FROM strategic_plans WHERE user_id = auth.uid()
  )
);

-- =====================================================
-- STRATEGIC PLAN POLICY ATTACHMENTS TABLE
-- =====================================================

-- Create strategic_plan_policy_attachments table
CREATE TABLE IF NOT EXISTS strategic_plan_policy_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES strategic_plan_policies(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_policy_attachments_policy_id ON strategic_plan_policy_attachments(policy_id);

-- Enable Row Level Security
ALTER TABLE strategic_plan_policy_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attachments
CREATE POLICY "Users can view attachments of their policy"
ON strategic_plan_policy_attachments FOR SELECT
USING (
  policy_id IN (
    SELECT id FROM strategic_plan_policies 
    WHERE strategic_plan_id IN (
      SELECT id FROM strategic_plans WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can insert attachments to their policy"
ON strategic_plan_policy_attachments FOR INSERT
WITH CHECK (
  policy_id IN (
    SELECT id FROM strategic_plan_policies 
    WHERE strategic_plan_id IN (
      SELECT id FROM strategic_plans WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete attachments of their policy"
ON strategic_plan_policy_attachments FOR DELETE
USING (
  policy_id IN (
    SELECT id FROM strategic_plan_policies 
    WHERE strategic_plan_id IN (
      SELECT id FROM strategic_plans WHERE user_id = auth.uid()
    )
  )
);

-- =====================================================
-- STORAGE BUCKET POLICIES FOR POLICY ATTACHMENTS
-- =====================================================

-- Storage policies for strategic-plan-policy-attachments bucket
-- Run these after creating the bucket in Supabase Dashboard

-- Allow users to upload policy attachments
CREATE POLICY "Users can upload policy attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'strategic-plan-policy-attachments' AND 
  auth.uid() IS NOT NULL
);

-- Allow users to view their policy attachments
CREATE POLICY "Users can view their policy attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'strategic-plan-policy-attachments' AND 
  auth.uid() IS NOT NULL
);

-- Allow users to delete their policy attachments
CREATE POLICY "Users can delete their policy attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'strategic-plan-policy-attachments' AND 
  auth.uid() IS NOT NULL
);
