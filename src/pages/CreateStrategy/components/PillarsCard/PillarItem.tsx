import { Edit, Trash2 } from 'lucide-react';
import { IconButton } from '../../../../components/ui';

export interface Pillar {
  id: string;
  name: string;
  description: string;
}

interface PillarItemProps {
  pillar: Pillar;
  onEdit: (pillar: Pillar) => void;
  onDelete: (id: string) => void;
}

const PillarItem = ({ pillar, onEdit, onDelete }: PillarItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[var(--text)]">{pillar.name}</span>
        {pillar.description && (
          <span className="text-xs text-[var(--muted)]">{pillar.description}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <IconButton
          onClick={() => onEdit(pillar)}
          aria-label="Edit Pillar"
          className="text-[var(--warning)] hover:bg-[var(--hover)]"
          icon={<Edit size={16} />}
        />
        <IconButton
          onClick={() => onDelete(pillar.id)}
          aria-label="Delete Pillar"
          className="text-[var(--danger)] hover:bg-[var(--hover)]"
          icon={<Trash2 size={16} />}
        />
      </div>
    </div>
  );
};

export default PillarItem;
