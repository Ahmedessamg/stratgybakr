import React from 'react';
import type { FieldError } from 'react-hook-form';

interface UiFormFieldProps {
  label?: string;
  required?: boolean;
  error?: FieldError;
  helper?: string;
  children: React.ReactNode;
}

const UiFormField: React.FC<UiFormFieldProps> = ({
  label,
  required,
  error,
  helper,
  children
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[var(--text)]">
          {label}
          {required && <span className="text-[var(--danger)] mr-1">*</span>}
        </label>
      )}
      {children}
      {helper && !error && (
        <p className="text-xs text-[var(--muted)]">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-[var(--danger)]" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default UiFormField;
