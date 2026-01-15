"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";
import { useErrorHandler } from "@/app/lib/errors/useErrorHandler";
import { handleSupabaseError } from "@/app/lib/utils/errorHandling";
import type { RsvpSubmission } from "@/app/lib/types";

export const useRsvpData = () => {
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { error, showError, clearError } = useErrorHandler();

  const fetchRsvps = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      // Fetch from the rsvp_submissions VIEW for formatted display data
      const { data, error: fetchError } = await supabase
        .from("rsvp_submissions")
        .select("*");

      if (fetchError) {
        const errorMessage = handleSupabaseError(
          fetchError,
          "Error fetching RSVPs",
          "Chyba při načítání RSVP odpovědí"
        );
        showError(errorMessage, "toast");
        // Re-throw Supabase errors so Sentry captures them
        throw new Error(errorMessage);
      } else {
        setRsvps(data || []);
      }
    } catch (error) {
      // This catches both network errors and re-thrown Supabase errors
      console.error("Fetch operation failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError, showError]);

  const deleteRsvp = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tuto RSVP odpověď?")) {
      return;
    }

    setDeletingId(id);
    clearError();

    try {
      // Delete from the base rsvps TABLE (not the view)
      // This will cascade delete all associated guests due to ON DELETE CASCADE
      const { error: deleteError } = await supabase
        .from("rsvps")
        .delete()
        .eq("id", id);

      if (deleteError) {
        const errorMessage = handleSupabaseError(
          deleteError,
          "Error deleting RSVP",
          "Chyba při mazání RSVP"
        );
        showError(errorMessage, "toast");
        // Re-throw Supabase errors so Sentry captures them
        throw new Error(errorMessage);
      } else {
        await fetchRsvps();
      }
    } catch (error) {
      // This catches both network errors and re-thrown Supabase errors
      console.error("Delete operation failed:", error);
      throw error;
    } finally {
      setDeletingId(null);
    }
  };

  return { rsvps, loading, deletingId, error, fetchRsvps, deleteRsvp, clearError };
};
