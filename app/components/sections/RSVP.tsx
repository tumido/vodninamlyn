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
import { logInfo, logError, logWarn } from "@/app/lib/utils/logger";
import { measureAsync, OperationType } from "@/app/lib/utils/performance";
import { metrics, trackRsvpSubmission, trackValidationError, MetricEvent } from "@/app/lib/utils/metrics";

const SUCCESS_ICONS = ["ufo", "fox", "clover"] as const;

const getRandomIcon = () => {
  return SUCCESS_ICONS[Math.floor(Math.random() * SUCCESS_ICONS.length)];
};

export const RSVP = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
    names: [],
    attending: "",
    accommodation: "",
    drinkChoice: "",
    customDrink: "",
    dietaryRestrictions: "",
    childrenCount: 0,
    petsCount: 0,
    message: "",
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
  const [lastInteractedField, setLastInteractedField] = useState<string | null>(null);
  const prevFormDataRef = useRef<RSVPFormData>(formData);

  useEffect(() => {
    setSuccessIcon(getRandomIcon());
  }, []);

  // Track form start when user first interacts
  useEffect(() => {
    if (formStartTime === null && (formData.names.length > 0 || formData.attending)) {
      setFormStartTime(Date.now());
      metrics.track(MetricEvent.RSVP_FORM_STARTED, {
        component: 'RSVP',
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
      if (formStartTime !== null && submitStatus !== 'success') {
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
          formName: 'RSVP',
          lastField: lastInteractedField || undefined,
          completionPercentage,
          timeSpentMs,
          component: 'RSVP',
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formStartTime, submitStatus, formData, lastInteractedField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus("idle");
    setIsSubmitting(true);

    // Track form submission start
    metrics.track(MetricEvent.RSVP_FORM_SUBMITTED, {
      component: 'RSVP',
      attending: formData.attending,
    });

    try {
      // Validate form data
      const validated = rsvpSchema.parse(formData);

      // Submit to Supabase with performance tracking
      const { data, error } = await measureAsync(
        OperationType.RSVP_SUBMIT,
        'submit_rsvp',
        async () => {
          return await supabase.rpc("submit_rsvp", {
            names: validated.names,
            attending: validated.attending,
            accommodation: validated.accommodation || null,
            drinkChoice: validated.drinkChoice || null,
            customDrink: validated.customDrink || null,
            dietaryRestrictions: validated.dietaryRestrictions || null,
            childrenCount: validated.childrenCount,
            petsCount: validated.petsCount,
            message: validated.message || null,
          });
        },
        {
          component: 'RSVP',
          metadata: {
            attending: validated.attending,
            guestCount: validated.names.length,
          },
        }
      );

      if (error) {
        logError("RSVP submission failed", error, {
          component: 'RSVP',
          operation: 'submit_rsvp',
        });

        // Track failure
        trackRsvpSubmission(false, {
          component: 'RSVP',
          errorMessage: error.message,
        });

        throw new Error(error.message);
      }

      logInfo("RSVP submitted successfully", {
        component: 'RSVP',
        operation: 'submit_rsvp',
        metadata: {
          primaryId: data,
          attending: validated.attending,
          guestCount: validated.names.length,
        },
      });

      // Track success
      trackRsvpSubmission(true, {
        component: 'RSVP',
        attending: validated.attending,
        guestCount: validated.names.length,
      });

      // Randomly select a success icon
      setSuccessIcon(getRandomIcon());

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
        childrenCount: 0,
        petsCount: 0,
        message: "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const parsedErrors = parseZodErrors(error);
        setErrors(parsedErrors);
        setSubmitStatus("error");

        // Track validation errors
        Object.entries(parsedErrors).forEach(([field, message]) => {
          trackValidationError(
            field,
            'validation_error',
            message
          );
        });

        logWarn("RSVP validation failed", {
          component: 'RSVP',
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
      <p className="text-xl leading-relaxed mb-12 max-w-2x text-center">
        Prosíme o potvrzení vaší účasti do {WEDDING_INFO.rsvpDeadline}. Pomůže
        nám to se připravit.
      </p>

      {submitStatus === "success" && !showForm ? (
        <div className="max-w-2xl mx-auto p-8 text-center space-y-12">
          <div
            className={`h-24 mx-auto ${
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
