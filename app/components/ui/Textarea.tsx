import type { TextareaHTMLAttributes } from "react";
import {
  BASE_INPUT_CLASSES,
  ERROR_CLASSES,
  NORMAL_CLASSES,
} from "@/app/lib/utils/formStyles";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = ({
  className = "",
  error,
  ...props
}: TextareaProps) => {
  const errorClasses = error ? ERROR_CLASSES : NORMAL_CLASSES;

  return (
    <textarea
      className={`${BASE_INPUT_CLASSES} ${errorClasses} ${className}`}
      {...props}
    />
  );
};
