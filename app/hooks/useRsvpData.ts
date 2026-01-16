"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";
import { useErrorHandler } from "@/app/lib/errors/useErrorHandler";
import type { RsvpSubmission } from "@/app/lib/types";
import {
  handleSupabaseError,
  logger,
  performance,
  metrics,
  OperationType,
  updateRsvpGauges,
  trackDrinkChoices,
  trackAccommodationTypes
} from "@/app/lib/monitoring";

export const useRsvpData = () => {
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { error, showError, clearError } = useErrorHandler();

  const fetchRsvps = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      // Fetch from the rsvp_submissions VIEW for formatted display data with performance tracking
      const result = await performance.measureAsync(
        OperationType.RSVP_FETCH,
        'fetch_rsvp_submissions',
        async () => {
          return await supabase
            .from("rsvp_submissions")
            .select("*");
        },
        {
          component: 'useRsvpData',
        }
      );

      const { data, error: fetchError } = result;

      if (fetchError) {
        const errorMessage = handleSupabaseError(
          fetchError,
          "Error fetching RSVPs",
          "Chyba při načítání RSVP odpovědí"
        );

        logger.error("Failed to fetch RSVPs", fetchError, {
          component: 'useRsvpData',
          operation: 'fetchRsvps',
        });

        showError(errorMessage, "toast");

        // Track admin operation failure
        metrics.trackAdminOperation('view', false, {
          component: 'useRsvpData',
          errorMessage,
        });

        // Re-throw Supabase errors so Sentry captures them
        throw new Error(errorMessage);
      } else {
        setRsvps(data || []);

        logger.info("RSVPs fetched successfully", {
          component: 'useRsvpData',
          operation: 'fetchRsvps',
          metadata: {
            count: data?.length || 0,
          },
        });

        // Track successful view
        metrics.trackAdminOperation('view', true, {
          component: 'useRsvpData',
          rsvpCount: data?.length || 0,
        });

        // Update gauge metrics for dashboard analytics
        if (data && data.length > 0) {
          updateRsvpGauges(data);
          trackDrinkChoices(data);
          trackAccommodationTypes(data);
        }
      }
    } catch (error) {
      // This catches both network errors and re-thrown Supabase errors
      logger.error("Fetch operation failed", error instanceof Error ? error : new Error(String(error)), {
        component: 'useRsvpData',
        operation: 'fetchRsvps',
      });
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
      // Delete from the base rsvps TABLE (not the view) with performance tracking
      // This will cascade delete all associated guests due to ON DELETE CASCADE
      const result = await performance.measureAsync(
        OperationType.RSVP_DELETE,
        'delete_rsvp',
        async () => {
          return await supabase
            .from("rsvps")
            .delete()
            .eq("id", id);
        },
        {
          component: 'useRsvpData',
          metadata: { rsvpId: id },
        }
      );

      const { error: deleteError } = result;

      if (deleteError) {
        const errorMessage = handleSupabaseError(
          deleteError,
          "Error deleting RSVP",
          "Chyba při mazání RSVP"
        );

        logger.error("Failed to delete RSVP", deleteError, {
          component: 'useRsvpData',
          operation: 'deleteRsvp',
          metadata: { rsvpId: id },
        });

        showError(errorMessage, "toast");

        // Track admin operation failure
        metrics.trackAdminOperation('delete', false, {
          component: 'useRsvpData',
          rsvpId: id,
          errorMessage,
        });

        // Re-throw Supabase errors so Sentry captures them
        throw new Error(errorMessage);
      } else {
        logger.info("RSVP deleted successfully", {
          component: 'useRsvpData',
          operation: 'deleteRsvp',
          metadata: { rsvpId: id },
        });

        // Track successful delete
        metrics.trackAdminOperation('delete', true, {
          component: 'useRsvpData',
          rsvpId: id,
        });

        await fetchRsvps();
      }
    } catch (error) {
      // This catches both network errors and re-thrown Supabase errors
      logger.error("Delete operation failed", error instanceof Error ? error : new Error(String(error)), {
        component: 'useRsvpData',
        operation: 'deleteRsvp',
        metadata: { rsvpId: id },
      });
      throw error;
    } finally {
      setDeletingId(null);
    }
  };

  return { rsvps, loading, deletingId, error, fetchRsvps, deleteRsvp, clearError };
};
