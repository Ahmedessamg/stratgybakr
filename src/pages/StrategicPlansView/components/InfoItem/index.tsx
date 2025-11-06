import { ReactNode } from "react";
import "./styles.scss";

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  iconBgColor?: string;
}

const InfoItem = ({ 
  icon, 
  label, 
  value, 
  valueColor = "#000919",
  iconBgColor = "#F7F7F9"
}: InfoItemProps) => {
  return (
    <div className="info-item">
      <div 
        className="info-item__icon" 
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <div className="info-item__content">
        <span className="info-item__label">{label}</span>
        <span className="info-item__value" style={{ color: valueColor }}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default InfoItem;

