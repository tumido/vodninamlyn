import {
  BASE_INPUT_CLASSES,
  ERROR_CLASSES,
  NORMAL_CLASSES,
} from "@/app/lib/utils/formStyles";

interface NumberInputProps {
  error?: string;
  id: string;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  value: number;
}

interface StepButtonProps {
  ariaLabel: string;
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}

const StepButton = ({
  ariaLabel,
  children,
  disabled,
  onClick,
}: StepButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="bg-palette-dark-green text-palette-beige hover:bg-palette-green flex h-8 w-8 items-center justify-center rounded-md text-xl font-bold transition-colors disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

export const NumberInput = ({
  error,
  id,
  max = 99,
  min = 0,
  onChange,
  value,
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
        className="w-16 flex-1 appearance-none border-none bg-transparent text-center text-lg outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
