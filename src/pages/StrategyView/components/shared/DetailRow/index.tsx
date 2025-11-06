import { ReactNode } from "react";
import "./styles.scss";

interface DetailRowProps {
  label: string;
  children: ReactNode;
}

const DetailRow = ({ label, children }: DetailRowProps) => {
  return (
    <div className="detail-row">
      <div className="detail-row__label">{label}</div>
      <div className="detail-row__content">{children}</div>
    </div>
  );
};

export default DetailRow;
