import {
  BASE_INPUT_CLASSES,
  ERROR_CLASSES,
  NORMAL_CLASSES,
} from "@/app/lib/utils/formStyles";

interface NumberInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  error?: string;
}

interface StepButtonProps {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

const StepButton = ({
  onClick,
  disabled,
  ariaLabel,
  children,
}: StepButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-8 h-8 flex items-center justify-center rounded-md bg-palette-dark-green text-palette-beige hover:bg-palette-green disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors text-xl font-bold"
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

export const NumberInput = ({
  id,
  value,
  onChange,
  min = 0,
  max = 99,
  error,
}: NumberInputProps) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const containerClasses = BASE_INPUT_CLASSES.replace("px-4 py-3", "px-2 py-2");
  const errorClasses = error ? ERROR_CLASSES : NORMAL_CLASSES;

  return (
    <div
      className={`${containerClasses} ${errorClasses} flex items-center gap-2`}
    >
      <StepButton
        onClick={handleDecrement}
        disabled={value <= min}
        ariaLabel="Snížit"
      >
        −
      </StepButton>
      <input
        type="number"
        id={id}
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
          }
        }}
        min={min}
        max={max}
        className="flex-1 text-center text-lg bg-transparent border-none outline-none w-16 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Počet"
      />
      <StepButton
        onClick={handleIncrement}
        disabled={value >= max}
        ariaLabel="Zvýšit"
      >
        +
      </StepButton>
    </div>
  );
};
