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
  const { user, loading: authLoading, logout } = useAuth();
  const {
    rsvps,
    loading: rsvpsLoading,
    deletingId,
    error: dataError,
    fetchRsvps,
    deleteRsvp,
    clearError: clearDataError,
  } = useRsvpData();
  const stats = useRsvpStats(rsvps);
  const {
    editingRow,
    isSaving,
    validationErrors,
    error: editorError,
    startEditing,
    cancelEditing,
    updateEditingRow,
    validateEditingRow,
    handleEditSubmit,
    clearError: clearEditorError,
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
      <div className="min-h-screen hero-gradient flex items-center justify-center">
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
    <div className="min-h-screen bg-palette-beige">
      <nav className="flex justify-end ml-auto gap-4 py-2 pr-2 sm:pr-6 lg:pr-8">
        <div className="justify-end h-16 items-center gap-4">
          <Button onClick={logout}>Odhlásit se</Button>
        </div>
      </nav>

      {currentError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-600"
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
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
            <div className="text-center py-12">
              <div className="text-lg">Načítání RSVP...</div>
            </div>
          ) : rsvps.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
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
            names: [],
            attending: "",
            accommodation: "",
            drinkChoice: "",
            customDrink: "",
            dietaryRestrictions: "",
            childrenCount: 0,
            petsCount: 0,
            message: "",
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
