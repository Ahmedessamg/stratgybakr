import { useTranslation } from "react-i18next";
import { Trash2, Edit, Eye } from "lucide-react";
import "./StrategyCard.scss";
import { Calendar } from "../../../../components/icons/svg";

export interface StrategyValue {
  name: string;
  description: string;
}

export interface StrategyPillar {
  name: string;
  description: string;
}

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: "active" | "draft" | "completed" | "archived";
  progress?: number;
  goals?: string[];
  visionMission?: string;
  focusAreas?: string[];
  strategicDetails?: string;
  values?: StrategyValue[];
  pillars?: StrategyPillar[];
  owner?: string;
  ownerRole?: string;
}

interface StrategyCardProps {
  strategy: Strategy;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const StrategyCard = ({
  strategy,
  onEdit,
  onDelete,
  onView,
}: StrategyCardProps) => {
  const { t } = useTranslation();

  // Get status text
  const getStatusText = (status?: string) => {
    if (!status) return t("strategy.status.draft");
    return t(`strategy.status.${status}`);
  };

  return (
    <div className="strategy-card">
      <div className="strategy-card__header">
        <div className="strategy-card__header-content">
          {/* Title and label */}
          <div className="strategy-card__title-wrapper">
            <p className="strategy-card__label">{t("strategy.planName")}</p>
            <h3 className="strategy-card__title">{strategy.name}</h3>
          </div>

          {/* Owner info - top right */}
          {strategy.owner && (
            <div className="strategy-card__owner">
              <div className="strategy-card__owner-avatar">
                {strategy.owner.charAt(0)}
              </div>
              <div className="strategy-card__owner-info">
                <span className="strategy-card__owner-label">
                  {strategy.ownerRole || t("strategy.owner")}
                </span>
                <span className="strategy-card__owner-name">
                  {strategy.owner}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Date cards - positioned at bottom */}
        <div className="strategy-card__dates">
          <div className="strategy-card__date">
            <Calendar
              className="strategy-card__date-icon"
              width={28}
              height={28}
            />
            <div className="strategy-card__date-content">
              <span className="strategy-card__date-label">
                {t("strategy.startsAt")}
              </span>
              <span className="strategy-card__date-value">
                {strategy.startDate}
              </span>
            </div>
          </div>

          <div className="strategy-card__date">
            <Calendar
              className="strategy-card__date-icon"
              width={28}
              height={28}
            />
            <div className="strategy-card__date-content">
              <span className="strategy-card__date-label">
                {t("strategy.endsAt")}
              </span>
              <span className="strategy-card__date-value">
                {strategy.endDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="strategy-card__body">
        <div className="strategy-card__footer">
          {/* Status label */}
          <div className="strategy-card__status">
            {t("strategy.statusLabel")}: {getStatusText(strategy.status)}
          </div>

          {/* Action buttons */}
          <div className="strategy-card__actions">
            <button
              className="strategy-card__action strategy-card__action--view"
              onClick={() => onView?.(strategy.id)}
              aria-label="View"
            >
              <Eye size={18} />
            </button>

            <button
              className="strategy-card__action strategy-card__action--edit"
              onClick={() => onEdit?.(strategy.id)}
              aria-label="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              className="strategy-card__action strategy-card__action--delete"
              onClick={() => onDelete?.(strategy.id)}
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
