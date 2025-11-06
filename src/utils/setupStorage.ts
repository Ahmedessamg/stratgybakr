import { supabase } from '../services/supabase/client';

export const setupStorageBucket = async () => {
  try {
    // First, try to test if we can access the bucket by listing files
    const { data: files, error: listError } = await supabase.storage
      .from('strategy-attachments')
      .list('', { limit: 1 });
    
    if (listError) {
      console.error('Error accessing bucket:', listError);
      
      // If it's a policy error, the bucket exists but we can't access it
      if (listError.message.includes('policy') || listError.message.includes('permission')) {
        console.log('Bucket exists but access denied - need to set up policies');
        return false;
      }
      
      // If it's a "not found" error, bucket doesn't exist
      if (listError.message.includes('not found') || listError.message.includes('does not exist')) {
        console.log('Bucket does not exist, trying to create...');
        
        // Try to create the bucket
        const { data, error } = await supabase.storage.createBucket('strategy-attachments', {
          public: false, // Private bucket
          fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
          allowedMimeTypes: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'video/mp4',
            'audio/mpeg'
          ]
        });

        if (error) {
          console.error('Error creating bucket:', error);
          return false;
        }

        console.log('Bucket created successfully:', data);
        return true;
      }
      
      return false;
    }

    console.log('Bucket accessible, files:', files);
    return true;
  } catch (error) {
    console.error('Error setting up storage:', error);
    return false;
  }
};
