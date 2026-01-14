"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface ChipInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  maxChips?: number;
  maxLength?: number;
}

export const ChipInput = ({
  values,
  onChange,
  placeholder = "Zadejte jméno",
  error,
  maxChips = 10,
  maxLength = 50,
}: ChipInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [inlineError, setInlineError] = useState("");
  const [flashError, setFlashError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sanitizeName = (value: string): string => {
    return value
      .trim()
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/[<>]/g, "") // Remove HTML chars (XSS prevention)
      .replace(/[^a-zA-ZÀ-žА-я\s'-]/g, "") // Allow only letters, spaces, hyphens, apostrophes (including Czech chars)
      .slice(0, maxLength); // Enforce max length
  };

  const addChip = (value: string) => {
    const sanitized = sanitizeName(value);

    // Validation checks
    if (!sanitized) {
      setInlineError("");
      return;
    }

    if (sanitized.length < 2) {
      setInlineError("Jméno musí mít alespoň 2 znaky");
      return;
    }

    if (values.length >= maxChips) {
      setInlineError(`Maximálně ${maxChips} jmen`);
      return;
    }

    // Check for duplicates (case-insensitive)
    if (values.some((name) => name.toLowerCase() === sanitized.toLowerCase())) {
      setInlineError("Toto jméno již bylo přidáno");
      // Flash red border
      setFlashError(true);
      setTimeout(() => setFlashError(false), 300);
      return;
    }

    // Add chip
    onChange([...values, sanitized]);
    setInputValue("");
    setInlineError("");

    // Announce to screen readers
    const announcement = document.getElementById("chip-status");
    if (announcement) {
      announcement.textContent = `Přidáno ${sanitized}`;
    }
  };

  const removeChip = (index: number) => {
    const removedName = values[index];
    onChange(values.filter((_, i) => i !== index));

    // Return focus to input
    inputRef.current?.focus();

    // Announce to screen readers
    const announcement = document.getElementById("chip-status");
    if (announcement) {
      announcement.textContent = `Odstraněno ${removedName}`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
      // Remove last chip when backspace on empty input
      removeChip(values.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addChip(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");

    // Check if paste contains commas - if so, split and add multiple names
    if (pastedText.includes(",")) {
      e.preventDefault();
      const names = pastedText
        .split(/[,;]/)
        .map((name) => name.trim())
        .filter((name) => name.length >= 2);

      names.forEach((name) => {
        if (values.length < maxChips) {
          const sanitized = sanitizeName(name);
          if (
            sanitized.length >= 2 &&
            !values.some((n) => n.toLowerCase() === sanitized.toLowerCase())
          ) {
            onChange([...values, sanitized]);
          }
        }
      });

      setInputValue("");
      setInlineError("");
    }
  };

  const baseClasses =
    "w-full min-h-[48px] px-2 py-2 rounded-lg border-2 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-palette-green focus-within:border-transparent";
  const errorClasses =
    error || flashError
      ? "border-red-300 bg-red-50"
      : "border-palette-green/20 bg-white/40 hover:border-palette-green";

  const isMaxChips = values.length >= maxChips;

  return (
    <div>
      <div
        className={`${baseClasses} ${errorClasses} flex flex-wrap gap-2 items-center`}
        role="group"
        aria-labelledby="names-label"
      >
        {/* Chips container */}
        {values.length > 0 && (
          <ul
            role="list"
            aria-label="Vybrané jména"
            className="flex flex-wrap gap-2 m-0 p-0"
          >
            {values.map((name, index) => (
              <li
                key={`${name}-${index}`}
                role="listitem"
                className="inline-flex items-center gap-1 px-3 py-1 bg-palette-green text-white rounded-full text-sm"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => removeChip(index)}
                  aria-label={`Odstranit ${name}`}
                  className="ml-1 hover:ring-2 hover:cursor-pointer transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-palette-green rounded-full"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setInlineError("");
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={values.length === 0 ? placeholder : ""}
          disabled={isMaxChips}
          aria-invalid={!!error}
          aria-describedby={error ? "names-error" : undefined}
          className="flex-1 min-w-[120px] border-none outline-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Screen reader announcements */}
      <div
        id="chip-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Inline error message */}
      {inlineError && (
        <p
          className="text-sm text-red-600 mt-1"
          role="alert"
          aria-live="assertive"
        >
          {inlineError}
        </p>
      )}

      {/* Max chips message */}
      {isMaxChips && !error && (
        <p className="text-sm text-neutral-500 mt-1">
          Dosažen maximální počet jmen ({maxChips})
        </p>
      )}
    </div>
  );
};
