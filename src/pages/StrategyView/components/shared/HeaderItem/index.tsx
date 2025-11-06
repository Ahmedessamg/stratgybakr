import { ReactNode } from "react";
import "./styles.scss";

interface HeaderItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const HeaderItem = ({ icon, label, value }: HeaderItemProps) => {
  return (
    <div className="header-item">
      <div className="header-item__icon-box">
        {icon}
      </div>
      <div className="header-item__content">
        <span className="header-item__label">{label}</span>
        <span className="header-item__value">{value}</span>
      </div>
    </div>
  );
};

export default HeaderItem;
