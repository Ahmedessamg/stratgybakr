import { useTranslation } from "react-i18next";
import { Globe, Building2, Clock, Calendar } from "lucide-react";
import { StrategicPlanData } from "@/services/supabase/strategicPlan/strategicPlan.service";
import { InfoItem, VisionMissionSection } from "../../index";
import dayjs from "dayjs";
import "./styles.scss";

interface DetailsTabProps {
  plan: StrategicPlanData;
}

const DetailsTab = ({ plan }: DetailsTabProps) => {
  const { t } = useTranslation();

  // Get status based on is_active
  const getStatusInfo = () => {
    if (plan.is_active) {
      return {
        label: t("strategicPlans.status.active"),
        color: "#FFBE00",
        bgColor: "rgba(255, 190, 0, 0.1)",
      };
    }
    return {
      label: t("strategicPlans.status.draft"),
      color: "#9F9F9F",
      bgColor: "#F7F7F9",
    };
  };

  const statusInfo = getStatusInfo();

  // Calculate duration if we have dates
  const calculateDuration = () => {
    if (plan.created_at && plan.updated_at) {
      const start = dayjs(plan.created_at);
      const end = dayjs(plan.updated_at);
      const days = end.diff(start, "day");
      return `${days} ${t("strategicPlans.details.days")}`;
    }
    return t("strategicPlans.details.notAvailable");
  };

  // Format target date
  const formatTargetDate = () => {
    if (plan.duration) {
      return plan.duration;
    }
    return t("strategicPlans.details.notAvailable");
  };

  return (
    <div className="details-tab">
      <div className="details-tab__info-section">
        <InfoItem
          icon={<Globe size={20} color="#00665E" />}
          label={t("strategicPlans.details.owner")}
          value={plan.owner || t("strategicPlans.details.notAvailable")}
        />
        <InfoItem
          icon={<Calendar size={20} color="#00665E" />}
          label={t("strategicPlans.details.targetDate")}
          value={formatTargetDate()}
        />
        <InfoItem
          icon={<Clock size={20} color="#00665E" />}
          label={t("strategicPlans.details.targetTime")}
          value={plan.duration || t("strategicPlans.details.notAvailable")}
        />
        <InfoItem
          icon={<Clock size={20} color="#00665E" />}
          label={t("strategicPlans.details.actualTime")}
          value={calculateDuration()}
        />
        <InfoItem
          icon={<Building2 size={20} color="#00665E" />}
          label={t("strategicPlans.details.department")}
          value={plan.element || t("strategicPlans.details.notAvailable")}
        />

        <InfoItem
          icon={<Globe size={20} color="#00665E" />}
          label={t("strategicPlans.details.privacy")}
          value={plan.privacy || t("strategicPlans.details.public")}
        />

        <InfoItem
          icon={<Clock size={20} color={statusInfo.color} />}
          label={t("strategicPlans.details.status")}
          value={statusInfo.label}
          valueColor={statusInfo.color}
          iconBgColor={statusInfo.bgColor}
        />
      </div>

      {/* Vision, Mission, Values, Focus Areas Section */}
      {(plan.vision || plan.message || plan.governing_values || plan.focus_areas) && (
        <VisionMissionSection
          vision={plan.vision}
          message={plan.message}
          values={plan.governing_values}
          focusAreas={plan.focus_areas}
        />
      )}
    </div>
  );
};

export default DetailsTab;
