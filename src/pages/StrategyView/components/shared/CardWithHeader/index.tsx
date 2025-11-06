import { ReactNode } from "react";
import "./styles.scss";

interface CardWithHeaderProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  noBorder?: boolean;
}

const CardWithHeader = ({
  icon,
  title,
  children,
  noBorder = false,
}: CardWithHeaderProps) => {
  return (
    <div className="card-with-header">
      <div className="card-with-header__header">
        {icon}
        <h4 className="card-with-header__title">{title}</h4>
      </div>
      <div
        className={`card-with-header__content ${noBorder ? "no-border" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default CardWithHeader;
