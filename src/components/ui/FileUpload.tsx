import React, { useCallback, useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  maxSize?: number; // in MB
  maxTotal?: number; // in MB
  accept?: string;
  multiple?: boolean;
}

interface FileWithPreview {
  file: File;
  id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange, 
  accept = '.pdf,.docx,.xlsx,.png,.jpg,.jpeg',
  multiple = true
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles).map(file => ({
      file,
      id: Math.random().toString(36)
    }));

    const updatedFiles = multiple ? [...files, ...fileArray] : fileArray;
    setFiles(updatedFiles);
    
    if (onFilesChange) {
      onFilesChange(updatedFiles.map(f => f.file));
    }
  }, [files, multiple, onFilesChange]);

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    if (onFilesChange) {
      onFilesChange(updatedFiles.map(f => f.file));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-[var(--primary)] bg-[var(--hover)]' : 'border-[var(--border)]'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto text-[var(--muted)] mb-4" />
        <p className="text-[var(--text)] mb-2">{t('strategy.attachments.dragDrop')}</p>
        <p className="text-sm text-[var(--muted)] mb-4">{t('strategy.attachments.or')}</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          {t('strategy.attachments.chooseFile')}
        </Button>
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <p className="text-xs text-[var(--muted)] mt-4">
          {t('strategy.attachments.supportedFormats')}
        </p>
        <p className="text-xs text-[var(--muted)]">
          {t('strategy.attachments.maxSize')}
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(({ file, id }) => (
            <div
              key={id}
              className="flex items-center justify-between p-3 bg-[var(--card)] border border-[var(--border)] rounded-md"
            >
              <div className="flex items-center gap-3 flex-1">
                <File className="w-5 h-5 text-[var(--muted)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(id)}
                className="p-1 hover:bg-[var(--hover)] rounded transition-colors"
              >
                <X className="w-4 h-4 text-[var(--danger)]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
