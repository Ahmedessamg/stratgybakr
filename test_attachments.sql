-- Test Attachments RLS Policies
-- Run this in Supabase SQL Editor to test if policies are working

-- 1. Check if RLS is enabled and policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'strategy_attachments';

-- 2. Test if we can insert a test record (this will show any RLS errors)
-- First, get a strategy ID that belongs to the current user
SELECT id, name, user_id 
FROM strategies 
WHERE user_id = auth.uid() 
LIMIT 1;

-- 3. Try to insert a test attachment (replace 'YOUR_STRATEGY_ID' with actual ID from step 2)
-- INSERT INTO strategy_attachments (strategy_id, file_name, file_path, file_size, file_type)
-- VALUES ('YOUR_STRATEGY_ID', 'test.pdf', 'test/path.pdf', 1024, 'application/pdf');

-- 4. Check current user
SELECT auth.uid() as current_user_id;
