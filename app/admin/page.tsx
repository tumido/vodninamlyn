"use client";

import { useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { useAuth } from "@/app/hooks/useAuth";
import { useRsvpData } from "@/app/hooks/useRsvpData";
import { useRsvpStats } from "@/app/hooks/useRsvpStats";
import { useRsvpEditor } from "@/app/hooks/useRsvpEditor";
import { RsvpStatsCards } from "@/app/components/admin/RsvpStatsCards";
import { RsvpTable } from "@/app/components/admin/RsvpTable";
import { EditRsvpModal } from "@/app/components/admin/EditRsvpModal";

export default function AdminPage() {
  const { loading: authLoading, logout, user } = useAuth();
  const {
    clearError: clearDataError,
    deleteRsvp,
    deletingId,
    error: dataError,
    fetchRsvps,
    loading: rsvpsLoading,
    rsvps,
  } = useRsvpData();
  const stats = useRsvpStats(rsvps);
  const {
    cancelEditing,
    clearError: clearEditorError,
    editingRow,
    error: editorError,
    handleEditSubmit,
    isSaving,
    startEditing,
    updateEditingRow,
    validateEditingRow,
    validationErrors,
  } = useRsvpEditor(fetchRsvps);

  useEffect(() => {
    if (user) {
      fetchRsvps();
    }
  }, [user, fetchRsvps]);

  const getEditingRsvpName = () => {
    if (!editingRow) return "";
    const rsvp = rsvps.find((r) => r.attendee_id === editingRow.attendeeId);
    if (!rsvp) return "";
    return `${rsvp.attendee_name}${rsvp.is_primary ? " (primární)" : ""}`;
  };

  if (authLoading || !user) {
    return (
      <div className="hero-gradient flex min-h-screen items-center justify-center">
        <div className="text-lg">Načítání...</div>
      </div>
    );
  }

  const currentError = dataError || editorError;
  const clearCurrentError = () => {
    if (dataError) clearDataError();
    if (editorError) clearEditorError();
  };

  return (
    <div className="bg-palette-beige min-h-screen">
      <nav className="ml-auto flex justify-end gap-4 py-2 pr-2 sm:pr-6 lg:pr-8">
        <div className="h-16 items-center justify-end gap-4">
          <Button onClick={logout}>Odhlásit se</Button>
        </div>
      </nav>

      {currentError && (
        <div className="mx-auto mb-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-800">
                {currentError.message}
              </span>
            </div>
            <button
              onClick={clearCurrentError}
              className="text-red-600 transition-colors hover:text-red-800"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <main className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {rsvpsLoading ? (
            <div className="py-12 text-center">
              <div className="text-lg">Načítání RSVP...</div>
            </div>
          ) : rsvps.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center text-gray-600 shadow">
              Zatím žádné RSVP odpovědi.
            </div>
          ) : (
            <>
              <RsvpStatsCards stats={stats} />
              <RsvpTable
                rsvps={rsvps}
                onEdit={startEditing}
                onDelete={deleteRsvp}
                deletingId={deletingId}
              />
            </>
          )}
        </div>
      </main>

      <EditRsvpModal
        isOpen={!!editingRow}
        rsvpName={getEditingRsvpName()}
        formData={
          editingRow?.formData || {
            accommodation: "",
            attending: "",
            childrenCount: 0,
            customDrink: "",
            dietaryRestrictions: "",
            drinkChoice: "",
            message: "",
            names: [],
            petsCount: 0,
          }
        }
        errors={validationErrors}
        isSaving={isSaving}
        onClose={cancelEditing}
        onSubmit={handleEditSubmit}
        onChange={updateEditingRow}
        onValidate={validateEditingRow}
      />
    </div>
  );
}
