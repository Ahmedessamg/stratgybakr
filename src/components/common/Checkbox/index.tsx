import { ChangeEvent } from "react";
import "./styles.scss";

interface CheckboxProps {
  id: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
}

const Checkbox = ({
  id,
  checked,
  onChange,
  label,
  className = "",
}: CheckboxProps) => {
  return (
    <div className={`custom-checkbox ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="custom-checkbox__input"
      />
      <label htmlFor={id} className="custom-checkbox__label">
        {label && <span className="custom-checkbox__text">{label}</span>}
      </label>
    </div>
  );
};

export default Checkbox;
