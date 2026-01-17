import type { ReactNode } from "react";

interface FormFieldProps {
  children: ReactNode;
  error?: string;
  htmlFor?: string;
  label: string;
  required?: boolean;
}

export const FormField = ({
  children,
  error,
  htmlFor,
  label,
  required,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
        {required && <span className="text-palette-orange ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
