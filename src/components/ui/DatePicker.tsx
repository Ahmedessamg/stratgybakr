 import { Controller } from 'react-hook-form';
import type { Control, Path, FieldValues, RegisterOptions } from 'react-hook-form';
// import { Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FormField from './FormField';

interface UiDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  label?: string;
  required?: boolean;
  helper?: string;
  disabled?: boolean;
  className?: string;
}

const UiDatePicker = <T extends FieldValues>({
  name,
  control,
  rules,
  label,
  required,
  helper,
  disabled,
  className = ''
}: UiDatePickerProps<T>) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

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
            <input
              type="date"
              {...field}
              value={field.value || ''}
              disabled={disabled}
              aria-invalid={fieldState.error ? 'true' : 'false'}
              className={`w-full px-3 py-2 ${isRTL ? 'pl-10 pr-3' : 'pr-10 pl-3'} bg-[var(--input-bg)] border border-[var(--border)] rounded-md text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${fieldState.error ? 'border-[var(--danger)]' : ''} ${className}`}
            />
            {/* <CalendarIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none`} /> */}
          </div>
        </FormField>
      )}
    />
  );
};

export default UiDatePicker;
