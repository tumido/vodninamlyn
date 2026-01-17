"use client";

import { FormField } from "@/app/components/ui/FormField";
import { ChipInput } from "@/app/components/ui/ChipInput";
import { Textarea } from "@/app/components/ui/Textarea";
import { Select } from "@/app/components/ui/Select";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { NumberInput } from "@/app/components/ui/NumberInput";
import {
  ATTENDING_OPTIONS,
  ACCOMMODATION_OPTIONS,
  DRINK_OPTIONS,
} from "@/app/lib/constants";
import type { RSVPFormData } from "@/app/lib/types";

interface RSVPFormProps {
  editMode?: boolean; // If true, shows immutable name field and hides message field
  editModeRsvpName?: string; // Name to display in edit mode
  errors: Record<string, string>;
  formData: RSVPFormData;
  isSubmitting: boolean;
  onCancel?: () => void; // Called when cancel is clicked in edit mode
  onChange: (formData: RSVPFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onValidate: () => boolean;
  submitLabel?: string; // Custom label for submit button
  submitStatus: "idle" | "success" | "error";
}

export const RSVPForm = ({
  editMode = false,
  editModeRsvpName,
  errors,
  formData,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
  onValidate,
  submitLabel = "Odeslat",
  submitStatus,
}: RSVPFormProps) => {
  const handleFieldChange = (
    field: keyof RSVPFormData,
    value: string | string[],
  ) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl p-4 md:p-8">
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
              id="names"
              values={formData.names}
              onChange={(names) => handleFieldChange("names", names)}
              placeholder="Zadejte jméno"
              error={errors.names}
            />
            <p className="mt-1 text-xs text-neutral-500">
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
              className="disabled:text-palette-green/80 disabled:hover:border-palette-green/20 bg-neutral-50"
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
            options={ATTENDING_OPTIONS}
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
                options={ACCOMMODATION_OPTIONS}
                placeholder="Vyberte možnost ubytování"
              />
            </FormField>

            {/* Children and Pets Count - Side by Side */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                label="Děti"
                error={errors.childrenCount}
                htmlFor="childrenCount"
              >
                <NumberInput
                  id="childrenCount"
                  value={formData.childrenCount}
                  onChange={(value) =>
                    onChange({ ...formData, childrenCount: value })
                  }
                  min={0}
                  max={20}
                  error={errors.childrenCount}
                />
              </FormField>

              <FormField
                label="Zvířátka"
                error={errors.petsCount}
                htmlFor="petsCount"
              >
                <NumberInput
                  id="petsCount"
                  value={formData.petsCount}
                  onChange={(value) =>
                    onChange({ ...formData, petsCount: value })
                  }
                  min={0}
                  max={20}
                  error={errors.petsCount}
                />
              </FormField>
            </div>

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
                    customDrink:
                      newValue !== "other" ? "" : formData.customDrink,
                    drinkChoice: newValue,
                  });
                }}
                error={errors.drinkChoice}
                options={DRINK_OPTIONS}
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
        <div className="flex gap-4 pt-4">
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
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-red-800">
            Něco se pokazilo. Zkontrolujte prosím formulář a zkuste to znovu.
          </div>
        )}
      </div>
    </form>
  );
};
