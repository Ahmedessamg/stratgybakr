# Supabase Storage Setup for Strategy Attachments

## Manual Setup (Recommended)

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Set the following:
   - **Name**: `strategy-attachments`
   - **Public**: `false` (private bucket)
   - **File size limit**: `50 MB`
   - **Allowed MIME types**: 
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
     - `image/png`
     - `image/jpeg`
     - `image/jpg`
     - `video/mp4`
     - `audio/mpeg`

### 2. Set Storage Policies

Go to [Supabase Storage Policies](https://supabase.com/dashboard/project/frvaavoxnwogyjztiziz/storage/policies) and add these 3 policies:

**Policy 1: Upload Files**
- Table: `storage.objects`
- Operation: `INSERT`
- Policy name: `Users can upload strategy attachments`
- Policy definition:
```sql
bucket_id = 'strategy-attachments'
```

**Policy 2: View Files**
- Table: `storage.objects`
- Operation: `SELECT`
- Policy name: `Users can view strategy attachments`
- Policy definition:
```sql
bucket_id = 'strategy-attachments'
```

**Policy 3: Delete Files**
- Table: `storage.objects`
- Operation: `DELETE`
- Policy name: `Users can delete strategy attachments`
- Policy definition:
```sql
bucket_id = 'strategy-attachments'
```

**Alternative: Use SQL Editor**
Run these SQL commands in your Supabase SQL Editor:

```sql
-- Allow users to upload strategy attachments
CREATE POLICY "Users can upload strategy attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'strategy-attachments');

-- Allow users to view strategy attachments
CREATE POLICY "Users can view strategy attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'strategy-attachments');

-- Allow users to delete strategy attachments
CREATE POLICY "Users can delete strategy attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'strategy-attachments');
```

### 3. Test the Setup

1. Go to your application
2. Navigate to Create Strategy page
3. Try uploading a file in the Attachments section
4. Check the browser console for any error messages

## Troubleshooting

### Common Issues:

1. **"Bucket not found"** - Make sure the bucket `strategy-attachments` exists
2. **"Permission denied"** - Check that the storage policies are correctly set
3. **"File too large"** - Check file size limits in bucket settings
4. **"Invalid MIME type"** - Check that the file type is in the allowed MIME types list

### Debug Steps:

1. Check browser console for detailed error messages
2. Verify bucket exists in Supabase Dashboard > Storage
3. Check storage policies in Supabase Dashboard > Authentication > Policies
4. Ensure user is authenticated before uploading

## File Organization

Files are organized in the storage bucket as:
```
strategy-attachments/
  {strategy_id}/
    {timestamp}.{extension}
```

Example:
```
strategy-attachments/
  abc123-def456-ghi789/
    1703123456789.pdf
    1703123456790.docx
```
