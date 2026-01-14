import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = ({
  error,
  className = "",
  ...props
}: TextareaProps) => {
  const baseClasses =
    "w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-palette-green/50 focus:border-transparent";
  const errorClasses = error
    ? "border-red-300 bg-red-50"
    : "border-palette-green/20 bg-white/40 hover:border-palette-green";

  return (
    <textarea
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  );
};
