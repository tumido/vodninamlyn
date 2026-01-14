"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import type { RSVPFormData } from "../../lib/types";
import type { RsvpSubmission } from "../lib/types";
import { rsvpEditSchema } from "../../lib/validations";
import { ZodError } from "zod";

interface EditingRow {
  attendeeId: string;
  formData: RSVPFormData;
}

export const useRsvpEditor = (onSuccess: () => void) => {
  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const startEditing = (rsvp: RsvpSubmission) => {
    setEditingRow({
      attendeeId: rsvp.attendee_id,
      formData: {
        names: [],
        attending: rsvp.attending,
        accommodation: (rsvp.accommodation || "") as RSVPFormData["accommodation"],
        drinkChoice: (rsvp.drinkChoice || "") as RSVPFormData["drinkChoice"],
        customDrink: rsvp.customDrink || "",
        dietaryRestrictions: rsvp.dietaryRestrictions || "",
        message: "",
      },
    });
    setValidationErrors({});
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
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        return errors;
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

    const { error } = await supabase
      .from("rsvps")
      .update(updateData)
      .eq("id", editingRow.attendeeId);

    if (error) {
      console.error("Error updating RSVP:", error);
      alert("Chyba při ukládání: " + error.message);
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
    startEditing,
    cancelEditing,
    updateEditingRow,
    validateEditingRow,
    handleEditSubmit,
  };
};
