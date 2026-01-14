"use client";

import { useState } from "react";
import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { rsvpSchema } from "@/app/lib/validations";
import type { RSVPFormData } from "@/app/lib/types";
import { ZodError } from "zod";
import Icon from "../ui/Icon";
import { supabase } from "@/app/lib/supabase";
import { RSVPForm } from "../forms/RSVPForm";

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

      // Submit to Supabase via the submit_rsvp function
      const { data, error } = await supabase.rpc("submit_rsvp", {
        names: validated.names,
        attending: validated.attending,
        accommodation: validated.accommodation || null,
        drinkChoice: validated.drinkChoice || null,
        customDrink: validated.customDrink || null,
        dietaryRestrictions: validated.dietaryRestrictions || null,
        message: validated.message || null,
      });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      console.log("RSVP submitted successfully. Primary ID:", data);

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
      } else {
        console.error("Submission error:", error);
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
      <h2 className="pb-12">Přijdeš? Řekni nám to!</h2>
      <p className="text-xl leading-relaxed mb-12 max-w-2x text-center">
        Prosíme o potvrzení vaší účasti do 1. dubna 2026. Pomůže nám to se
        připravit.
      </p>

      {submitStatus === "success" && !showForm ? (
        <div className="max-w-2xl mx-auto p-8 text-center space-y-12">
          <div className="h-24 w-24 mx-auto">
            <Icon icon="heart" />
          </div>
          <h3 className="mb-2">Děkujeme za potvrzení!</h3>
          <p className="text-lg">Těšíme se na vás.</p>
          <Button onClick={handleNewSubmission}>Odeslat další odpověď</Button>
        </div>
      ) : (
        <RSVPForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
          onSubmit={handleSubmit}
          onChange={setFormData}
          onValidate={isFormValid}
        />
      )}
    </Section>
  );
};
