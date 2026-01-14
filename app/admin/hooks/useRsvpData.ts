"use client";

import { useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import type { RsvpSubmission } from "../lib/types";

export const useRsvpData = () => {
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRsvps = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("rsvp_submissions").select("*");

    if (error) {
      console.error("Error fetching RSVPs:", error);
    } else {
      setRsvps(data || []);
    }
    setLoading(false);
  }, []);

  const deleteRsvp = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tuto RSVP odpověď?")) {
      return;
    }

    setDeletingId(id);
    const { error } = await supabase.from("rsvps").delete().eq("id", id);

    if (error) {
      console.error("Error deleting RSVP:", error);
      alert("Chyba při mazání RSVP: " + error.message);
    } else {
      await fetchRsvps();
    }
    setDeletingId(null);
  };

  return { rsvps, loading, deletingId, fetchRsvps, deleteRsvp };
};
