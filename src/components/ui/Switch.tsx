import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import './Switch.scss';

interface SwitchProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
}

const Switch = <T extends FieldValues>({ name, control, label }: SwitchProps<T>) => {
  return (
    <div className="switch-field">
      {label && <label className="switch-field__label">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <label className="switch">
            <input
              type="checkbox"
              checked={field.value === true || field.value === 'true'}
              onChange={(e) => field.onChange(e.target.checked)}
            />
            <span className="switch__slider"></span>
          </label>
        )}
      />
    </div>
  );
};

export default Switch;

