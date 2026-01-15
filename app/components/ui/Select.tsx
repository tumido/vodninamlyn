import type { SelectHTMLAttributes } from "react";
import { ERROR_CLASSES, NORMAL_CLASSES } from "@/app/lib/utils/formStyles";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}

export const Select = ({
  error,
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) => {
  // Select has different padding (pr-10 for dropdown arrow) and needs appearance-none
  const baseClasses =
    "w-full pl-4 pr-10 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-palette-green/50 focus:border-transparent bg-white appearance-none";
  const errorClasses = error ? ERROR_CLASSES : NORMAL_CLASSES;
  const placeholderClasses =
    !props.value || props.value === "" ? "text-neutral-500/90" : "";

  return (
    <div className="relative">
      <select
        className={`${baseClasses} ${errorClasses} ${placeholderClasses} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
        <svg
          className="h-5 w-5 text-neutral-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
