import { useTranslation } from "react-i18next";
import "./styles.scss";

interface VisionMissionSectionProps {
  vision?: string;
  message?: string;
  values?: string;
  focusAreas?: string;
}

interface SectionItemProps {
  label: string;
  content: string;
}

const SectionItem = ({ label, content }: SectionItemProps) => {
  return (
    <div className="vision-mission-section__item">
      <div className="vision-mission-section__label">{label}</div>
      <div className="vision-mission-section__content">{content}</div>
    </div>
  );
};

const VisionMissionSection = ({
  vision,
  message,
  values,
  focusAreas,
}: VisionMissionSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="vision-mission-section">
      {vision && <SectionItem label={t("strategicPlans.visionMission.vision")} content={vision} />}
      {message && <SectionItem label={t("strategicPlans.visionMission.message")} content={message} />}
      {values && <SectionItem label={t("strategicPlans.visionMission.values")} content={values} />}
      {focusAreas && (
        <SectionItem label={t("strategicPlans.visionMission.focusAreas")} content={focusAreas} />
      )}
    </div>
  );
};

export default VisionMissionSection;
