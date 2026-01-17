import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export const Button = ({
  children,
  disabled,
  isLoading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className="bg-palette-dark-green text-palette-beige hover:bg-palette-green w-full cursor-pointer rounded-full px-8 py-3 font-medium transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Odesílám...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
