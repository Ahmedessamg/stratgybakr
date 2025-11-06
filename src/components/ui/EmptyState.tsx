import { FileText } from 'lucide-react';

interface UiEmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  image?: string;
}

const UiEmptyState = ({
   icon = <FileText className="w-48 h-48" />,
  image,
  // message,
}: UiEmptyStateProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center py-12 text-[var(--muted)]"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {image ? (
        <img 
          src={image} 
          alt="No data" 
          className="w-[400px] h-[400px] object-contain mb-4"
        />
      ) : (
        <div className="mb-6">{icon}</div>
      )}
      {/* {message && (
        <p className="text-sm text-center text-[var(--text)] font-medium">
          {message}
        </p>
      )} */}
    </div>
  );
};

export default UiEmptyState;
