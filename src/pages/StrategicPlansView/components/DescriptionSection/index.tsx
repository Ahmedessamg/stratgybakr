import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";

interface DescriptionSectionProps {
  label: string;
  description: string;
  maxLength?: number;
}

const DescriptionSection = ({ 
  label, 
  description, 
  maxLength = 300 
}: DescriptionSectionProps) => {
  const { t } = useTranslation();
  const [showFull, setShowFull] = useState(false);

  const shouldTruncate = description.length > maxLength;
  const displayText = shouldTruncate && !showFull
    ? description.slice(0, maxLength) + "..."
    : description;

  return (
    <div className="description-section">
      <div className="description-section__header">
        <span className="description-section__label">{label}</span>
      </div>
      <p className="description-section__text">{displayText}</p>
      {shouldTruncate && (
        <button
          className="description-section__toggle"
          onClick={() => setShowFull(!showFull)}
        >
          {showFull
            ? t("strategicPlans.details.showLess")
            : t("strategicPlans.details.showMore")}
        </button>
      )}
    </div>
  );
};

export default DescriptionSection;

