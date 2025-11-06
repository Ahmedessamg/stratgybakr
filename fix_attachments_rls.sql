-- Fix Attachments RLS Policies
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/frvaavoxnwogyjztiziz/sql/new

-- 1. Check current RLS status
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'strategy_attachments';

-- 2. Check existing policies
SELECT * FROM pg_policies 
WHERE tablename = 'strategy_attachments';

-- 3. Enable RLS if not already enabled
ALTER TABLE strategy_attachments ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if any (optional, only if they exist)
DROP POLICY IF EXISTS "Users can insert attachments to their strategies" ON strategy_attachments;
DROP POLICY IF EXISTS "Users can view attachments of their strategies" ON strategy_attachments;
DROP POLICY IF EXISTS "Users can delete attachments of their strategies" ON strategy_attachments;

-- 5. Create new policies that allow authenticated users
CREATE POLICY "Users can insert attachments to their strategies"
ON strategy_attachments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_attachments.strategy_id
    AND strategies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view attachments of their strategies"
ON strategy_attachments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_attachments.strategy_id
    AND strategies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete attachments of their strategies"
ON strategy_attachments FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM strategies
    WHERE strategies.id = strategy_attachments.strategy_id
    AND strategies.user_id = auth.uid()
  )
);

-- 6. Verify policies were created
SELECT * FROM pg_policies 
WHERE tablename = 'strategy_attachments';
