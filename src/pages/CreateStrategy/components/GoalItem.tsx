import { Trash2, Edit } from 'lucide-react';

interface BaseGoal {
  id: string;
  name: string;
  duration: string;
  element: string;
  description: string | null;
  status: boolean;
}

interface GoalItemProps {
  goal: BaseGoal;
  onEdit?: (goal: BaseGoal) => void;
  onDelete: (id: string) => void;
  isLast?: boolean;
}

const GoalItem = ({ goal, onEdit, onDelete, isLast = false }: GoalItemProps) => {
  return (
    <div 
      className={`grid grid-cols-2 gap-4 p-3 bg-[var(--card)] hover:bg-[var(--hover)] transition-colors ${
        !isLast ? 'border-b border-[var(--border)]' : ''
      }`}
    >
      {/* Goal Name with Status */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text)] flex-1">
          {goal.name}
        </span>
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${goal.status ? 'bg-[var(--success)]' : 'bg-gray-300'}`} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onEdit(goal);
            }}
            className="p-2 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors"
            aria-label="Edit"
            title="تعديل"
          >
            <Edit className="w-4 h-4 text-yellow-600" />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete(goal.id);
          }}
          className="p-2 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          aria-label="Delete"
          title="حذف"
        >
          <Trash2 className="w-4 h-4 text-[var(--danger)]" />
        </button>
      </div>
    </div>
  );
};

export default GoalItem;
