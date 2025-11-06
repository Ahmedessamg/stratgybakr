import { useState } from "react";
import { Checkbox } from "@/components/common";
import { Edit, Trash2 } from "lucide-react";
import "./styles.scss";

interface GoalItemProps {
  id: string;
  text: string;
  isRTL?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const GoalItem = ({
  id,
  text,
  isRTL = false,
  defaultChecked = false,
  onChange,
  onEdit,
  onDelete,
  showActions = false,
}: GoalItemProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div className="goal-item">
      <div className={`goal-item__content ${isRTL ? "rtl" : "ltr"}`}>
        <Checkbox id={id} checked={checked} onChange={handleChange} />
        <p className="goal-item__text">{text}</p>
        {showActions && (onEdit || onDelete) && (
          <div className="goal-item__actions">
            {onEdit && (
              <button
                className="goal-item__action-btn goal-item__action-btn--edit"
                onClick={onEdit}
                title="Edit"
              >
                <Edit size={14} />
              </button>
            )}
            {onDelete && (
              <button
                className="goal-item__action-btn goal-item__action-btn--delete"
                onClick={onDelete}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalItem;
