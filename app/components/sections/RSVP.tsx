"use client";

import { useState } from "react";
import { Section } from "../ui/Section";
import { FormField } from "../ui/FormField";
import { ChipInput } from "../ui/ChipInput";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { rsvpSchema } from "@/app/lib/validations";
import type { RSVPFormData } from "@/app/lib/types";
import { ZodError } from "zod";
import Icon from "../ui/Icon";

export const RSVP = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
    names: [],
    attending: "",
    accommodation: "",
    drinkChoice: "",
    customDrink: "",
    dietaryRestrictions: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus("idle");
    setIsSubmitting(true);

    try {
      // Validate form data
      const validated = rsvpSchema.parse(formData);

      // TODO: Submit to Supabase Edge Function
      // For now, just simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("RSVP Data:", validated);

      setSubmitStatus("success");
      setShowForm(false);
      // Reset form
      setFormData({
        names: [],
        attending: "",
        accommodation: "",
        drinkChoice: "",
        customDrink: "",
        dietaryRestrictions: "",
        message: "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const formErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            formErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(formErrors);
      }
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewSubmission = () => {
    setShowForm(true);
    setSubmitStatus("idle");
    setErrors({});
  };

  const isFormValid = () => {
    // Check if names array has at least one name
    if (formData.names.length === 0) return false;

    // Check if attending is selected
    if (!formData.attending) return false;

    // If attending "yes", check additional required fields
    if (formData.attending === "yes") {
      if (!formData.accommodation) return false;
      if (!formData.drinkChoice) return false;

      // If drinkChoice is "other", customDrink is required
      if (formData.drinkChoice === "other" && !formData.customDrink?.trim()) {
        return false;
      }
    }

    return true;
  };

  return (
    <Section id="rsvp" animate={true}>
      <h2 className="text-4xl mx-auto text-center pb-12">
        Přijdeš? Řekni nám to!
      </h2>
      <p className="text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
        Prosíme o potvrzení vaší účasti do 1. dubna 2026. Pomůže nám to se
        připravit.
      </p>

      {submitStatus === "success" && !showForm ? (
        <div className="max-w-2xl mx-auto p-8 text-center space-y-12">
          <div className="h-24 w-24 mx-auto">
            <Icon icon="heart" />
          </div>
          <h3 className="text-2xl mb-2">Děkujeme za potvrzení!</h3>
          <p className="text-lg">Těšíme se na vás.</p>
          <Button onClick={handleNewSubmission}>Odeslat další odpověď</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8">
          <div className="space-y-6">
            {/* Names - ChipInput */}
            <FormField
              label="Jména těch, za které formulář vyplňujete"
              error={errors.names}
              required
              htmlFor="names"
            >
              <ChipInput
                values={formData.names}
                onChange={(names) => setFormData({ ...formData, names })}
                placeholder="Zadejte jméno"
                error={errors.names}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Můžete přidat více jmen - po každém jménu stiskněte Enter nebo
                napište čárku
              </p>
            </FormField>

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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attending: e.target.value as RSVPFormData["attending"],
                  })
                }
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
                      setFormData({
                        ...formData,
                        accommodation: e.target
                          .value as RSVPFormData["accommodation"],
                      })
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        drinkChoice: e.target
                          .value as RSVPFormData["drinkChoice"],
                        customDrink:
                          e.target.value !== "other"
                            ? ""
                            : formData.customDrink,
                      })
                    }
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
                        setFormData({
                          ...formData,
                          customDrink: e.target.value,
                        })
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
                      setFormData({
                        ...formData,
                        dietaryRestrictions: e.target.value,
                      })
                    }
                    error={errors.dietaryRestrictions}
                    rows={3}
                    placeholder="Máme se něčemu vyvarovat? Alergie, bez-maso..."
                  />
                </FormField>
              </>
            )}

            {/* Message - always shown */}
            <FormField
              label="Dotaz, prosba, připomínka? Sem s tím!"
              error={errors.message}
              htmlFor="message"
            >
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                error={errors.message}
                rows={4}
                placeholder="Chtěli byste nám něco napsat? Políčko pro ty, co musí mít vždy poslední slovo."
              />
            </FormField>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!isFormValid()}
              >
                Odeslat potvrzení
              </Button>
            </div>

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
                Něco se pokazilo. Zkontrolujte prosím formulář a zkuste to
                znovu.
              </div>
            )}
          </div>
        </form>
      )}
    </Section>
  );
};
