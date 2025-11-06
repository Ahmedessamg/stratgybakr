import { Controller } from "react-hook-form";
import type {
  Control,
  Path,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import FormField from "./FormField";
import { ChevronDown } from "lucide-react";
import { ChangeEvent, ReactNode } from "react";

interface UiSelectOption {
  value: string;
  label: string;
}

interface UiSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  helper?: string;
  disabled?: boolean;
  options: UiSelectOption[];
  className?: string;
  icon?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const UiSelect = <T extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder,
  required,
  helper,
  disabled,
  options,
  className = "",
  icon,
  onChange,
}: UiSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField
          label={label}
          required={required}
          error={fieldState.error}
          helper={helper}
        >
          <div className="relative">
            {icon && <div data-has-icon="true" className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2">{icon}</div>}
            <select
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (onChange) { onChange(e); }
                }} 
                disabled={disabled}
                aria-invalid={fieldState.error ? "true" : "false"}
                className={`w-full ${icon ? 'ltr:pl-9 rtl:pr-9' : 'px-3'} py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-md text-[var(--text)] appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                fieldState.error ? "border-[var(--danger)]" : ""
                } ${className}`}
              >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
          </div>
        </FormField>
      )}
    />
  );
};

export default UiSelect;
