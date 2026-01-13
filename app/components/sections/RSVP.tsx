"use client";

import { useState } from "react";
import { Section } from "../ui/Section";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { rsvpSchema } from "@/app/lib/validations";
import type { RSVPFormData } from "@/app/lib/types";

export const RSVP = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: "",
    email: "",
    attending: "ano",
    plusOne: false,
    plusOneName: "",
    mealPreference: undefined,
    dietaryRestrictions: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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
      // Reset form
      setFormData({
        name: "",
        email: "",
        attending: "ano",
        plusOne: false,
        plusOneName: "",
        mealPreference: undefined,
        dietaryRestrictions: "",
        message: "",
      });
    } catch (error: any) {
      if (error.errors) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            formErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formErrors);
      }
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mealOptions = [
    { value: "maso", label: "Maso" },
    { value: "ryba", label: "Ryba" },
    { value: "vegetarian", label: "Vegetariánské" },
    { value: "vegan", label: "Veganské" },
  ];

  return (
    <Section id="rsvp" className="bg-neutral-50" animate={true}>
      <h2 className="text-4xl md:text-5xl font-serif font-light text-center text-neutral-900 mb-4">
        Potvrzení účasti
      </h2>
      <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
        Prosíme o potvrzení vaší účasti do 1. května 2026
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border-2 border-neutral-100"
      >
        <div className="space-y-6">
          {/* Name */}
          <FormField
            label="Jméno a příjmení"
            error={errors.name}
            required
            htmlFor="name"
          >
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              placeholder="Jana Nováková"
            />
          </FormField>

          {/* Email */}
          <FormField
            label="Email"
            error={errors.email}
            required
            htmlFor="email"
          >
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              placeholder="jana@example.com"
            />
          </FormField>

          {/* Attending */}
          <FormField label="Zúčastním se" error={errors.attending} required>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="attending"
                  value="ano"
                  checked={formData.attending === "ano"}
                  onChange={(e) =>
                    setFormData({ ...formData, attending: "ano" })
                  }
                  className="w-4 h-4 text-pastel-blue focus:ring-pastel-blue"
                />
                <span>Ano</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="attending"
                  value="ne"
                  checked={formData.attending === "ne"}
                  onChange={(e) =>
                    setFormData({ ...formData, attending: "ne" })
                  }
                  className="w-4 h-4 text-pastel-blue focus:ring-pastel-blue"
                />
                <span>Ne</span>
              </label>
            </div>
          </FormField>

          {/* Plus One */}
          <FormField label="Doprovodná osoba">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.plusOne}
                onChange={(e) =>
                  setFormData({ ...formData, plusOne: e.target.checked })
                }
                className="w-4 h-4 text-pastel-blue rounded focus:ring-pastel-blue"
              />
              <span>Přijdu s doprovodem</span>
            </label>
          </FormField>

          {/* Plus One Name (conditional) */}
          {formData.plusOne && (
            <FormField
              label="Jméno doprovodu"
              error={errors.plusOneName}
              required
              htmlFor="plusOneName"
            >
              <Input
                id="plusOneName"
                type="text"
                value={formData.plusOneName}
                onChange={(e) =>
                  setFormData({ ...formData, plusOneName: e.target.value })
                }
                error={errors.plusOneName}
                placeholder="Petr Novák"
              />
            </FormField>
          )}

          {/* Meal Preference (conditional - only if attending) */}
          {formData.attending === "ano" && (
            <FormField
              label="Preferovaný oběd"
              error={errors.mealPreference}
              required
              htmlFor="mealPreference"
            >
              <Select
                id="mealPreference"
                value={formData.mealPreference || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mealPreference: e.target.value as any,
                  })
                }
                options={mealOptions}
                placeholder="Vyberte preferenci"
                error={errors.mealPreference}
              />
            </FormField>
          )}

          {/* Dietary Restrictions */}
          <FormField
            label="Dietní omezení"
            error={errors.dietaryRestrictions}
            htmlFor="dietaryRestrictions"
          >
            <textarea
              id="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dietaryRestrictions: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 bg-white hover:border-pastel-blue-light transition-colors focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent"
              rows={3}
              placeholder="Alergie, vegetariánství, veganství..."
            />
          </FormField>

          {/* Message */}
          <FormField label="Vzkaz" error={errors.message} htmlFor="message">
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 bg-white hover:border-pastel-blue-light transition-colors focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent"
              rows={4}
              placeholder="Napište nám vzkaz..."
            />
          </FormField>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full"
            >
              Odeslat potvrzení
            </Button>
          </div>

          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-800">
              ✓ Děkujeme za potvrzení! Těšíme se na vás.
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
              Něco se pokazilo. Zkontrolujte prosím formulář a zkuste to znovu.
            </div>
          )}
        </div>
      </form>
    </Section>
  );
};
