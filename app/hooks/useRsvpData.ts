"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";
import { useErrorHandler } from "@/app/lib/errors/useErrorHandler";
import type { RsvpSubmission } from "@/app/lib/types";

export const useRsvpData = () => {
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { error, showError, clearError } = useErrorHandler();

  const fetchRsvps = useCallback(async () => {
    setLoading(true);
    clearError();
    // Fetch from the rsvp_submissions VIEW for formatted display data
    const { data, error: fetchError } = await supabase
      .from("rsvp_submissions")
      .select("*");

    if (fetchError) {
      console.error("Error fetching RSVPs:", fetchError);
      showError("Chyba při načítání RSVP odpovědí: " + fetchError.message, "toast");
    } else {
      setRsvps(data || []);
    }
    setLoading(false);
  }, [clearError, showError]);

  const deleteRsvp = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tuto RSVP odpověď?")) {
      return;
    }

    setDeletingId(id);
    clearError();
    // Delete from the base rsvps TABLE (not the view)
    // This will cascade delete all associated guests due to ON DELETE CASCADE
    const { error: deleteError } = await supabase
      .from("rsvps")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting RSVP:", deleteError);
      showError("Chyba při mazání RSVP: " + deleteError.message, "toast");
    } else {
      await fetchRsvps();
    }
    setDeletingId(null);
  };

  return { rsvps, loading, deletingId, error, fetchRsvps, deleteRsvp, clearError };
};
