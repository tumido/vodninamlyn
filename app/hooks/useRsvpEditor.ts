"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useErrorHandler } from "@/app/lib/errors/useErrorHandler";
import { parseZodErrors } from "@/app/lib/utils/zodHelpers";
import type { RSVPFormData } from "@/app/lib/types";
import type { RsvpSubmission } from "@/app/lib/types";
import { rsvpEditSchema } from "@/app/lib/validations";
import { ZodError } from "zod";
import {
  handleSupabaseError,
  logger,
  performance,
  metrics,
  OperationType
} from "@/app/lib/monitoring";

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
        childrenCount: rsvp.childrenCount,
        petsCount: rsvp.petsCount,
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
        childrenCount: editingRow.formData.childrenCount,
        petsCount: editingRow.formData.petsCount,
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

    try {
      const updateData: Record<string, string | number | null> = {
        attending: editingRow.formData.attending,
        accommodation: editingRow.formData.accommodation || null,
        drink_choice: editingRow.formData.drinkChoice || null,
        custom_drink: editingRow.formData.customDrink || null,
        dietary_restrictions: editingRow.formData.dietaryRestrictions || null,
        children_count: editingRow.formData.childrenCount,
        pets_count: editingRow.formData.petsCount,
      };

      // Update the base rsvps TABLE (not the view) using attendee_id with performance tracking
      const result = await performance.measureAsync(
        OperationType.RSVP_UPDATE,
        'update_rsvp',
        async () => {
          return await supabase
            .from("rsvps")
            .update(updateData)
            .eq("id", editingRow.attendeeId);
        },
        {
          component: 'useRsvpEditor',
          metadata: {
            attendeeId: editingRow.attendeeId,
            attending: editingRow.formData.attending,
          },
        }
      );

      const { error: updateError } = result;

      if (updateError) {
        const errorMessage = handleSupabaseError(
          updateError,
          "Error updating RSVP",
          "Chyba při ukládání"
        );

        logger.error("Failed to update RSVP", updateError, {
          component: 'useRsvpEditor',
          operation: 'handleEditSubmit',
          metadata: { attendeeId: editingRow.attendeeId },
        });

        showError(errorMessage, "toast");

        // Track admin operation failure
        metrics.trackAdminOperation('edit', false, {
          component: 'useRsvpEditor',
          attendeeId: editingRow.attendeeId,
          errorMessage,
        });

        // Re-throw Supabase errors so Sentry captures them
        throw new Error(errorMessage);
      } else {
        logger.info("RSVP updated successfully", {
          component: 'useRsvpEditor',
          operation: 'handleEditSubmit',
          metadata: {
            attendeeId: editingRow.attendeeId,
            attending: editingRow.formData.attending,
          },
        });

        // Track successful edit
        metrics.trackAdminOperation('edit', true, {
          component: 'useRsvpEditor',
          attendeeId: editingRow.attendeeId,
          attending: editingRow.formData.attending,
        });

        onSuccess();
        setEditingRow(null);
        setValidationErrors({});
      }
    } catch (error) {
      logger.error("Network error during update", error instanceof Error ? error : new Error(String(error)), {
        component: 'useRsvpEditor',
        operation: 'handleEditSubmit',
        metadata: { attendeeId: editingRow.attendeeId },
      });
      // Re-throw network errors so Sentry captures them
      throw error;
    } finally {
      setIsSaving(false);
    }
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
