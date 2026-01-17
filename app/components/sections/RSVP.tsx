"use client";

import { useState, useEffect, useRef } from "react";
import { Section } from "@/app/components/ui/Section";
import { Button } from "@/app/components/ui/Button";
import { rsvpSchema } from "@/app/lib/validations";
import type { RSVPFormData } from "@/app/lib/types";
import { ZodError } from "zod";
import { parseZodErrors } from "@/app/lib/utils/zodHelpers";
import Icon from "@/app/components/ui/Icon";
import { supabase } from "@/app/lib/supabase";
import { RSVPForm } from "@/app/components/forms/RSVPForm";
import { WEDDING_INFO } from "@/app/lib/constants";
import {
  logger,
  performance,
  metrics,
  OperationType,
  MetricEvent,
} from "@/app/lib/monitoring";

const SUCCESS_ICONS = ["wolf", "fox", "clover"] as const;

const getRandomIcon = () => {
  return SUCCESS_ICONS[Math.floor(Math.random() * SUCCESS_ICONS.length)];
};

export const RSVP = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
    accommodation: "",
    attending: "",
    childrenCount: 0,
    customDrink: "",
    dietaryRestrictions: "",
    drinkChoice: "",
    message: "",
    names: [],
    petsCount: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showForm, setShowForm] = useState(true);
  const [successIcon, setSuccessIcon] =
    useState<(typeof SUCCESS_ICONS)[number]>("fox");
  const [formStartTime, setFormStartTime] = useState<number | null>(null);
  const [lastInteractedField, setLastInteractedField] = useState<string | null>(
    null,
  );
  const prevFormDataRef = useRef<RSVPFormData>(formData);

  useEffect(() => {
    setSuccessIcon(getRandomIcon());
  }, []);

  // Track form start when user first interacts
  useEffect(() => {
    if (
      formStartTime === null &&
      (formData.names.length > 0 || formData.attending)
    ) {
      setFormStartTime(Date.now());
      metrics.track(MetricEvent.RSVP_FORM_STARTED, {
        component: "RSVP",
      });
    }
  }, [formData, formStartTime]);

  // Track which field changed
  useEffect(() => {
    const prev = prevFormDataRef.current;

    for (const key in formData) {
      const k = key as keyof RSVPFormData;
      if (JSON.stringify(prev[k]) !== JSON.stringify(formData[k])) {
        setLastInteractedField(key);
        break;
      }
    }

    prevFormDataRef.current = formData;
  }, [formData]);

  // Track form abandonment when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only track abandonment if form was started but not submitted
      if (formStartTime !== null && submitStatus !== "success") {
        const totalFields = 5; // names, attending, accommodation, drinkChoice, dietaryRestrictions
        let filledFields = 0;
        if (formData.names.length > 0) filledFields++;
        if (formData.attending) filledFields++;
        if (formData.accommodation) filledFields++;
        if (formData.drinkChoice) filledFields++;
        if (formData.dietaryRestrictions) filledFields++;

        const completionPercentage = (filledFields / totalFields) * 100;
        const timeSpentMs = Date.now() - formStartTime;

        metrics.trackFormAbandonment({
          completionPercentage,
          component: "RSVP",
          formName: "RSVP",
          lastField: lastInteractedField || undefined,
          timeSpentMs,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formStartTime, submitStatus, formData, lastInteractedField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus("idle");
    setIsSubmitting(true);

    // Track form submission start
    metrics.track(MetricEvent.RSVP_FORM_SUBMITTED, {
      attending: formData.attending,
      component: "RSVP",
    });

    try {
      // Validate form data
      const validated = rsvpSchema.parse(formData);

      // Submit to Supabase with performance tracking
      const { data, error } = await performance.measureAsync(
        OperationType.RSVP_SUBMIT,
        "submit_rsvp",
        async () => {
          return await supabase.rpc("submit_rsvp", {
            accommodation: validated.accommodation || null,
            attending: validated.attending,
            childrenCount: validated.childrenCount,
            customDrink: validated.customDrink || null,
            dietaryRestrictions: validated.dietaryRestrictions || null,
            drinkChoice: validated.drinkChoice || null,
            message: validated.message || null,
            names: validated.names,
            petsCount: validated.petsCount,
          });
        },
        {
          component: "RSVP",
          metadata: {
            attending: validated.attending,
            guestCount: validated.names.length,
          },
        },
      );

      if (error) {
        logger.error("RSVP submission failed", error, {
          component: "RSVP",
          operation: "submit_rsvp",
        });

        // Track failure
        metrics.trackRsvpSubmission(false, {
          component: "RSVP",
          errorMessage: error.message,
        });

        throw new Error(error.message);
      }

      logger.info("RSVP submitted successfully", {
        component: "RSVP",
        metadata: {
          attending: validated.attending,
          guestCount: validated.names.length,
          primaryId: data,
        },
        operation: "submit_rsvp",
      });

      // Track success
      metrics.trackRsvpSubmission(true, {
        attending: validated.attending,
        component: "RSVP",
        guestCount: validated.names.length,
      });

      // Randomly select a success icon
      setSuccessIcon(getRandomIcon());

      setSubmitStatus("success");
      setShowForm(false);
      // Reset form
      setFormData({
        accommodation: "",
        attending: "",
        childrenCount: 0,
        customDrink: "",
        dietaryRestrictions: "",
        drinkChoice: "",
        message: "",
        names: [],
        petsCount: 0,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const parsedErrors = parseZodErrors(error);
        setErrors(parsedErrors);
        setSubmitStatus("error");

        // Track validation errors
        Object.entries(parsedErrors).forEach(([field, message]) => {
          metrics.trackValidationError(field, "validation_error", message);
        });

        logger.warn("RSVP validation failed", {
          component: "RSVP",
          metadata: {
            errorCount: Object.keys(parsedErrors).length,
            fields: Object.keys(parsedErrors),
          },
        });
      } else {
        // Re-throw non-validation errors so they're caught by Sentry
        throw error;
      }
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
      <p className="max-w-2x mb-12 text-center text-xl leading-relaxed">
        Prosíme o potvrzení vaší účasti do {WEDDING_INFO.rsvpDeadline}. Pomůže
        nám to se připravit.
      </p>

      {submitStatus === "success" && !showForm ? (
        <div className="mx-auto max-w-2xl space-y-12 p-8 text-center">
          <div
            className={`mx-auto h-24 ${
              successIcon === "fox" ? "aspect-20/9" : "w-24"
            }`}
          >
            <Icon icon={successIcon} />
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
