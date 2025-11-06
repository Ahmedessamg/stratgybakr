import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Upload, File, Download, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { CardContent, Button } from '../../../../components/ui';
import { strategyService } from '../../../../services/supabase/strategy';
import { setupStorageBucket } from '../../../../utils/setupStorage';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import type { StrategyAttachment } from '../../../../services/supabase/strategy/types';

interface AttachmentData {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
}

interface AttachmentsCardProps {
  draftStrategyId: string | null;
  isEditMode?: boolean;
}

const AttachmentsCard = ({ draftStrategyId, isEditMode = false }: AttachmentsCardProps) => {
  const { t } = useTranslation();
  const [attachments, setAttachments] = useLocalStorage<AttachmentData[]>('strategyAttachments', []);
  const [existingAttachments, setExistingAttachments] = useState<StrategyAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load existing attachments from database (edit mode only)
  const loadExistingAttachments = useCallback(async () => {
    if (!draftStrategyId || !isEditMode) return;
    
    try {
      setLoading(true);
      console.log('📂 Loading existing attachments for strategy:', draftStrategyId);
      const data = await strategyService.getAttachments(draftStrategyId);
      console.log('✅ Loaded existing attachments:', data);
      setExistingAttachments(data);
    } catch (error) {
      console.error('❌ Error loading existing attachments:', error);
      toast.error(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [draftStrategyId, isEditMode, t]);

  // Setup storage bucket and load existing attachments on mount
  useEffect(() => {
    const initializeAttachments = async () => {
      // Setup storage bucket first
      await setupStorageBucket();
      
      // Load existing attachments if in edit mode
      if (isEditMode) {
        loadExistingAttachments();
      }
    };

    initializeAttachments();
  }, [isEditMode, loadExistingAttachments]);

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    if (!draftStrategyId) {
      toast.error(t('messages.saveError'));
      return;
    }

    setUploading(true);
    
    try {
      // Ensure storage bucket exists
      const bucketReady = await setupStorageBucket();
      if (!bucketReady) {
        throw new Error('Storage bucket not available');
      }

      const newAttachments: AttachmentData[] = [];

      for (const file of files) {
        // Upload file to Supabase Storage
        const filePath = await strategyService.uploadFile(file, draftStrategyId);
        
        // Create attachment data for localStorage
        const attachmentData: AttachmentData = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type
        };

        newAttachments.push(attachmentData);
      }
      
      // Add to localStorage
      console.log('📝 Adding to localStorage:', newAttachments);
      setAttachments((prev: AttachmentData[]) => {
        const updated = [...prev, ...newAttachments];
        console.log('📝 Updated attachments array:', updated);
        return updated;
      });
      
      toast.success(t('messages.uploadSuccess'));
    } catch (error) {
      console.error('Error uploading files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for specific storage errors
      if (errorMessage.includes('bucket') || errorMessage.includes('storage') || errorMessage.includes('not found') || errorMessage.includes('policy')) {
        toast.error(
          <div>
            <p><strong>Storage Access Issue:</strong></p>
            <p>The bucket exists but you need to set up storage policies:</p>
            <ol style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px' }}>
              <li>Go to <a href="https://supabase.com/dashboard/project/frvaavoxnwogyjztiziz/storage/policies" target="_blank" style={{ color: '#3b82f6' }}>Supabase Storage Policies</a></li>
              <li>Click "New Policy" for storage.objects table</li>
              <li>Add these 3 policies (see STORAGE_SETUP.md for details)</li>
              <li>Refresh this page</li>
            </ol>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Error: {errorMessage}
            </p>
          </div>
        );
      } else {
        toast.error(`${t('messages.uploadError')}: ${errorMessage}`);
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle file delete from localStorage
  const handleDeleteAttachment = (attachment: AttachmentData) => {
    try {
      // Remove from localStorage
      setAttachments((prev: AttachmentData[]) => prev.filter((att: AttachmentData) => att.id !== attachment.id));
      
      // Optionally delete from storage (or keep as orphan for now)
      // await strategyService.deleteFile(attachment.file_path);
      
      toast.success(t('messages.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error(t('messages.deleteError'));
    }
  };

  // Handle delete existing attachment (edit mode)
  const handleDeleteExistingAttachment = async (attachment: StrategyAttachment) => {
    try {
      setLoading(true);
      
      // Delete from database
      await strategyService.deleteAttachment(attachment.id);
      
      // Delete from storage
      await strategyService.deleteFile(attachment.file_path);
      
      // Remove from existing attachments
      setExistingAttachments((prev: StrategyAttachment[]) => prev.filter((att: StrategyAttachment) => att.id !== attachment.id));
      
      toast.success(t('messages.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting existing attachment:', error);
      toast.error(t('messages.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    return '📎';
  };

  return (
    <CardContent
      title={t('strategy.attachments.title')}
      subtitle={t('strategy.attachments.caption')}
      icon={<FileText />}
      defaultOpen={true}
    >
      <div className="space-y-4">
        {/* File Upload Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            handleFileUpload(files);
          }}
          className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center hover:border-[var(--primary)] transition-colors"
        >
          <Upload className="w-12 h-12 mx-auto text-[var(--muted)] mb-4" />
          <p className="text-[var(--text)] mb-2">{t('strategy.attachments.dragDrop')}</p>
          <p className="text-sm text-[var(--muted)] mb-4">{t('strategy.attachments.or')}</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={!draftStrategyId || uploading}
          >
            {uploading ? t('common.loading') : t('strategy.attachments.chooseFile')}
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.mp4,.mp3"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(Array.from(e.target.files));
              }
            }}
            className="hidden"
          />
          <p className="text-xs text-[var(--muted)] mt-4">
            {t('strategy.attachments.supportedFormats')}
          </p>
        </div>

        {/* Existing Attachments (Edit Mode) */}
        {isEditMode && existingAttachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[var(--text)]">
              {t('strategy.attachments.existingFiles')} ({existingAttachments.length})
            </h4>
            {existingAttachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-[var(--card)] border border-[var(--border)] rounded-md hover:bg-[var(--hover)] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(attachment.file_type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">
                      {attachment.file_name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatFileSize(attachment.file_size)} • {attachment.file_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => {
                      // Open file in new tab for download/view
                      window.open(attachment.file_path, '_blank');
                    }}
                    className="text-[var(--primary)] p-1"
                  >
                    {t('common.download')}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDeleteExistingAttachment(attachment)}
                    disabled={loading}
                    className="text-[var(--danger)] p-1"
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Attachments (localStorage) */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[var(--text)]">
              {t('strategy.attachments.newFiles')} ({attachments.length})
            </h4>
            {attachments.map((attachment: AttachmentData) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-[var(--card)] border border-[var(--border)] rounded-md hover:bg-[var(--hover)] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(attachment.file_type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">
                      {attachment.file_name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatFileSize(attachment.file_size)} • {attachment.file_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => {
                      // Open file in new tab for download/view
                      window.open(attachment.file_path, '_blank');
                    }}
                    className="text-[var(--primary)] p-1"
                  >
                    {t('common.download')}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDeleteAttachment(attachment)}
                    disabled={loading}
                    className="text-[var(--danger)] p-1"
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <p className="text-sm text-[var(--muted)]">{t('common.loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && attachments.length === 0 && (!isEditMode || existingAttachments.length === 0) && (
          <div className="text-center py-8">
            <File className="w-12 h-12 mx-auto text-[var(--muted)] mb-4" />
            <p className="text-sm text-[var(--muted)]">
              {t('strategy.attachments.noFiles')}
            </p>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default AttachmentsCard;
