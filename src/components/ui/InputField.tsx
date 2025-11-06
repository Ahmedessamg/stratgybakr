import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-md text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  );
};

export default InputField;
