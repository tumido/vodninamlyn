import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}

export const FormField = ({ label, error, children, required, htmlFor }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-pastel-orange-dark ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};
