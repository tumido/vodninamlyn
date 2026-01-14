"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useErrorHandler } from "../../lib/errors/useErrorHandler";
import { parseZodErrors } from "../../lib/utils/zodHelpers";
import type { RSVPFormData } from "../../lib/types";
import type { RsvpSubmission } from "../../lib/types";
import { rsvpEditSchema } from "../../lib/validations";
import { ZodError } from "zod";

interface EditingRow {
  attendeeId: string;
  formData: RSVPFormData;
}

export const useRsvpEditor = (onSuccess: () => void) => {
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const { error, showError, clearError } = useErrorHandler();

  const startEditing = (rsvp: RsvpSubmission) => {
    setEditingRow({
      attendeeId: rsvp.attendee_id,
      formData: {
        names: [],
        attending: rsvp.attending,
        accommodation: (rsvp.accommodation as RSVPFormData["accommodation"]) || "",
        drinkChoice: (rsvp.drinkChoice as RSVPFormData["drinkChoice"]) || "",
        customDrink: rsvp.customDrink || "",
        dietaryRestrictions: rsvp.dietaryRestrictions || "",
        message: "",
      },
    });
    setValidationErrors({});
    clearError();
  };

  const cancelEditing = () => {
    setEditingRow(null);
    setValidationErrors({});
  };

  const updateEditingRow = (formData: RSVPFormData) => {
    if (!editingRow) return;
    setEditingRow({
      ...editingRow,
      formData,
    });
  };

  const validate = (): Record<string, string> => {
    if (!editingRow) return {};
    try {
      rsvpEditSchema.parse({
        attending: editingRow.formData.attending,
        accommodation: editingRow.formData.accommodation || "",
        drinkChoice: editingRow.formData.drinkChoice || "",
        customDrink: editingRow.formData.customDrink,
        dietaryRestrictions: editingRow.formData.dietaryRestrictions,
      });
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        return parseZodErrors(error);
      }
      throw error;
    }
  };

  const validateEditingRow = (): boolean => {
    try {
      const errors = validate();
      return Object.keys(errors).length === 0;
    } catch {
      return false;
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    try {
      const errors = validate();
      setValidationErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } catch {
      return;
    }

    setIsSaving(true);

    const updateData: Record<string, string | null> = {
      attending: editingRow.formData.attending,
      accommodation: editingRow.formData.accommodation || null,
      drink_choice: editingRow.formData.drinkChoice || null,
      custom_drink: editingRow.formData.customDrink || null,
      dietary_restrictions: editingRow.formData.dietaryRestrictions || null,
    };

    // Update the base rsvps TABLE (not the view) using attendee_id
    const { error: updateError } = await supabase
      .from("rsvps")
      .update(updateData)
      .eq("id", editingRow.attendeeId);

    if (updateError) {
      console.error("Error updating RSVP:", updateError);
      showError("Chyba při ukládání: " + updateError.message, "toast");
    } else {
      onSuccess();
      setEditingRow(null);
      setValidationErrors({});
    }

    setIsSaving(false);
  };

  return {
    editingRow,
    isSaving,
    validationErrors,
    error,
    startEditing,
    cancelEditing,
    updateEditingRow,
    validateEditingRow,
    handleEditSubmit,
    clearError,
  };
};
