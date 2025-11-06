-- Create the strategic-plan-attachments bucket (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 
  'strategic-plan-attachments',
  'strategic-plan-attachments',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ]
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'strategic-plan-attachments'
);

-- Create RLS policies for the bucket (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload strategic plan attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own strategic plan attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own strategic plan attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own strategic plan attachments" ON storage.objects;

CREATE POLICY "Users can upload strategic plan attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'strategic-plan-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own strategic plan attachments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'strategic-plan-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own strategic plan attachments" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'strategic-plan-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own strategic plan attachments" ON storage.objects
FOR DELETE USING (
  bucket_id = 'strategic-plan-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
