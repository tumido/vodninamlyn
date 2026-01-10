import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({ error, className = '', ...props }: InputProps) => {
  const baseClasses = 'w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent';
  const errorClasses = error
    ? 'border-red-300 bg-red-50'
    : 'border-neutral-200 bg-white hover:border-pastel-blue-light';

  return (
    <input
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};
