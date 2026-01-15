import type { InputHTMLAttributes } from "react";
import {
  BASE_INPUT_CLASSES,
  ERROR_CLASSES,
  NORMAL_CLASSES,
} from "@/app/lib/utils/formStyles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({ error, className = "", ...props }: InputProps) => {
  const errorClasses = error ? ERROR_CLASSES : NORMAL_CLASSES;

  return (
    <input
      className={`${BASE_INPUT_CLASSES} ${errorClasses} ${className}`}
      {...props}
    />
  );
};
