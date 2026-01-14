"use client";

import { FormField } from "../ui/FormField";
import { ChipInput } from "../ui/ChipInput";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { RSVPFormData } from "@/app/lib/types";

interface RSVPFormProps {
  formData: RSVPFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitStatus: "idle" | "success" | "error";
  onSubmit: (e: React.FormEvent) => void;
  onChange: (formData: RSVPFormData) => void;
  onValidate: () => boolean;
  editMode?: boolean; // If true, shows immutable name field and hides message field
  editModeRsvpName?: string; // Name to display in edit mode
  onCancel?: () => void; // Called when cancel is clicked in edit mode
  submitLabel?: string; // Custom label for submit button
}

export const RSVPForm = ({
  formData,
  errors,
  isSubmitting,
  submitStatus,
  onSubmit,
  onChange,
  onValidate,
  editMode = false,
  editModeRsvpName,
  onCancel,
  submitLabel = "Odeslat",
}: RSVPFormProps) => {
  const handleFieldChange = (
    field: keyof RSVPFormData,
    value: string | string[]
  ) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        {/* Names - ChipInput (in regular mode) or immutable field (in edit mode) */}
        {!editMode ? (
          <FormField
            label="Jména těch, za které formulář vyplňujete"
            error={errors.names}
            required
            htmlFor="names"
          >
            <ChipInput
              values={formData.names}
              onChange={(names) => handleFieldChange("names", names)}
              placeholder="Zadejte jméno"
              error={errors.names}
            />
            <p className="text-xs text-neutral-500 mt-1">
              Můžete přidat více jmen - po každém jménu stiskněte Enter nebo
              napište čárku
            </p>
          </FormField>
        ) : (
          <FormField label="Jméno" htmlFor="name-readonly">
            <Input
              id="name-readonly"
              type="text"
              value={editModeRsvpName || ""}
              disabled
              className="bg-neutral-50 disabled:text-palette-green/80 disabled:hover:border-palette-green/20"
            />
          </FormField>
        )}

        {/* Attendance */}
        <FormField
          label="Uvidíme se na svatbě?"
          error={errors.attending}
          required
          htmlFor="attending"
        >
          <Select
            id="attending"
            value={formData.attending}
            onChange={(e) => handleFieldChange("attending", e.target.value)}
            error={errors.attending}
            options={[
              { value: "yes", label: "Ano, přijdeme" },
              { value: "no", label: "Bohužel se nemůžeme zúčastnit" },
            ]}
            placeholder="Zúčastníte se?"
          />
        </FormField>

        {/* Show remaining fields only if attending */}
        {formData.attending === "yes" && (
          <>
            {/* Accommodation */}
            <FormField
              label="Ubytování"
              error={errors.accommodation}
              required
              htmlFor="accommodation"
            >
              <Select
                id="accommodation"
                value={formData.accommodation}
                onChange={(e) =>
                  handleFieldChange("accommodation", e.target.value)
                }
                error={errors.accommodation}
                options={[
                  { value: "roof", label: "Chci spát pod střechou" },
                  {
                    value: "own-tent",
                    label: "Přivezu si vlastní střechu",
                  },
                  { value: "no-sleep", label: "Nepřespím" },
                ]}
                placeholder="Vyberte možnost ubytování"
              />
            </FormField>

            {/* Drink Choice */}
            <FormField
              label="Čeho plánujete vypít nejvíc?"
              error={errors.drinkChoice}
              required
              htmlFor="drinkChoice"
            >
              <Select
                id="drinkChoice"
                value={formData.drinkChoice}
                onChange={(e) => {
                  const newValue = e.target
                    .value as RSVPFormData["drinkChoice"];
                  onChange({
                    ...formData,
                    drinkChoice: newValue,
                    customDrink:
                      newValue !== "other" ? "" : formData.customDrink,
                  });
                }}
                error={errors.drinkChoice}
                options={[
                  { value: "pivo", label: "Pivo" },
                  { value: "vino", label: "Víno" },
                  { value: "nealko", label: "Nealko" },
                  { value: "other", label: "Něco jiného" },
                ]}
                placeholder="Vyberte si"
              />
            </FormField>

            {/* Custom Drink - shown only when "other" is selected */}
            {formData.drinkChoice === "other" && (
              <FormField
                label="Pán je gurmán. Tož nám to řekni"
                error={errors.customDrink}
                required
                htmlFor="customDrink"
              >
                <Input
                  id="customDrink"
                  type="text"
                  value={formData.customDrink}
                  onChange={(e) =>
                    handleFieldChange("customDrink", e.target.value)
                  }
                  error={errors.customDrink}
                  placeholder="Jaký nápoj byste chtěli?"
                />
              </FormField>
            )}

            {/* Dietary Restrictions */}
            <FormField
              label="Dietní omezení"
              error={errors.dietaryRestrictions}
              htmlFor="dietaryRestrictions"
            >
              <Textarea
                id="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  handleFieldChange("dietaryRestrictions", e.target.value)
                }
                error={errors.dietaryRestrictions}
                rows={3}
                placeholder="Máme se něčemu vyvarovat? Alergie, bez-maso..."
              />
            </FormField>
          </>
        )}

        {/* Message (hidden in edit mode) */}
        {!editMode && (
          <FormField
            label="Dotaz, prosba, připomínka? Sem s tím!"
            error={errors.message}
            htmlFor="message"
          >
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleFieldChange("message", e.target.value)}
              error={errors.message}
              rows={4}
              placeholder="Chtěli byste nám něco napsat? Políčko pro ty, co musí mít vždy poslední slovo."
            />
          </FormField>
        )}

        {/* Submit and Cancel Buttons */}
        <div className="pt-4 flex gap-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!onValidate()}
          >
            {submitLabel}
          </Button>
          {editMode && onCancel && (
            <Button type="button" onClick={onCancel} disabled={isSubmitting}>
              Zrušit
            </Button>
          )}
        </div>

        {/* Error Message */}
        {submitStatus === "error" && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
            Něco se pokazilo. Zkontrolujte prosím formulář a zkuste to znovu.
          </div>
        )}
      </div>
    </form>
  );
};
