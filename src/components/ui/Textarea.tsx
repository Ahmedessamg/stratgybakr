 import { Controller } from 'react-hook-form';
import type { Control, Path, FieldValues, RegisterOptions } from 'react-hook-form';
import FormField from './FormField';

interface UiTextareaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  helper?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

const UiTextarea = <T extends FieldValues>({
  name,
  control,
  rules,
  label,
  placeholder,
  required,
  helper,
  disabled,
  rows = 4,
  className = ''
}: UiTextareaProps<T>) => {
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
          <textarea
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            aria-invalid={fieldState.error ? 'true' : 'false'}
            className={`w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-md text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none ${fieldState.error ? 'border-[var(--danger)]' : ''} ${className}`}
          />
        </FormField>
      )}
    />
  );
};

export default UiTextarea;
