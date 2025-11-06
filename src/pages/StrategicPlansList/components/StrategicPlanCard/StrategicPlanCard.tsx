import { useTranslation } from "react-i18next";
import { Trash2, Edit, Eye } from "lucide-react";
import "./StrategicPlanCard.scss";
import { Calendar } from "../../../../components/icons/svg";

export interface StrategicPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: "active" | "draft" | "completed" | "archived";
  owner?: string;
  ownerRole?: string;
  department?: string;
}

interface StrategicPlanCardProps {
  plan: StrategicPlan;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const StrategicPlanCard = ({
  plan,
  onEdit,
  onDelete,
  onView,
}: StrategicPlanCardProps) => {
  const { t } = useTranslation();

  const getStatusText = (status?: string) => {
    if (!status) return t("strategicPlans.status.draft");
    return t(`strategicPlans.status.${status}`);
  };

  return (
    <div className="strategic-plan-card">
      <div className="strategic-plan-card__header">
        <div className="strategic-plan-card__header-content">
          <div className="strategic-plan-card__title-wrapper">
            <p className="strategic-plan-card__label">{t("strategicPlans.planName")}</p>
            <h3 className="strategic-plan-card__title">{plan.name}</h3>
          </div>

          {plan.owner && (
            <div className="strategic-plan-card__owner">
              <div className="strategic-plan-card__owner-avatar">
                {plan.owner.charAt(0)}
              </div>
              <div className="strategic-plan-card__owner-info">
                <span className="strategic-plan-card__owner-label">
                  {plan.ownerRole || t("strategicPlans.owner")}
                </span>
                <span className="strategic-plan-card__owner-name">
                  {plan.owner}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="strategic-plan-card__dates">
          <div className="strategic-plan-card__date">
            <Calendar
              className="strategic-plan-card__date-icon"
              width={28}
              height={28}
            />
            <div className="strategic-plan-card__date-content">
              <span className="strategic-plan-card__date-label">
                {t("strategicPlans.startsAt")}
              </span>
              <span className="strategic-plan-card__date-value">
                {plan.startDate}
              </span>
            </div>
          </div>

          <div className="strategic-plan-card__date">
            <Calendar
              className="strategic-plan-card__date-icon"
              width={28}
              height={28}
            />
            <div className="strategic-plan-card__date-content">
              <span className="strategic-plan-card__date-label">
                {t("strategicPlans.endsAt")}
              </span>
              <span className="strategic-plan-card__date-value">
                {plan.endDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="strategic-plan-card__body">
        <div className="strategic-plan-card__footer">
          <div className="strategic-plan-card__status">
            {t("strategicPlans.statusLabel")}: {getStatusText(plan.status)}
          </div>

          <div className="strategic-plan-card__actions">
            <button
              className="strategic-plan-card__action strategic-plan-card__action--view"
              onClick={() => onView?.(plan.id)}
              aria-label="View"
            >
              <Eye size={18} />
            </button>

            <button
              className="strategic-plan-card__action strategic-plan-card__action--edit"
              onClick={() => onEdit?.(plan.id)}
              aria-label="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              className="strategic-plan-card__action strategic-plan-card__action--delete"
              onClick={() => onDelete?.(plan.id)}
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

export default StrategicPlanCard;

