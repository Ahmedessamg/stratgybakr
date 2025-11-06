import { Edit, Trash2 } from 'lucide-react';
import { IconButton } from '../../../../components/ui';

export interface Value {
  id: string;
  name: string;
  description: string;
}

interface ValueItemProps {
  value: Value;
  onEdit: (value: Value) => void;
  onDelete: (id: string) => void;
}

const ValueItem = ({ value, onEdit, onDelete }: ValueItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--text)]">{value.name}</span>
        {value.description && (
          <span className="text-xs text-[var(--muted)]">{value.description}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <IconButton
          onClick={() => onEdit(value)}
          aria-label="Edit Value"
          className="text-[var(--warning)] hover:bg-[var(--hover)]"
          icon={<Edit size={16} />}
        />
        <IconButton
          onClick={() => onDelete(value.id)}
          aria-label="Delete Value"
          className="text-[var(--danger)] hover:bg-[var(--hover)]"
          icon={<Trash2 size={16} />}
        />
      </div>
    </div>
  );
};

export default ValueItem;
