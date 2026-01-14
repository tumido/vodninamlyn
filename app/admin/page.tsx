"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/Button";
import { useAuth } from "./hooks/useAuth";
import { useRsvpData } from "./hooks/useRsvpData";
import { useRsvpStats } from "./hooks/useRsvpStats";
import { useRsvpEditor } from "./hooks/useRsvpEditor";
import { RsvpStatsCards } from "./components/RsvpStatsCards";
import { RsvpTable } from "./components/RsvpTable";
import { EditRsvpModal } from "./components/EditRsvpModal";

export default function AdminPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { rsvps, loading: rsvpsLoading, deletingId, fetchRsvps, deleteRsvp } = useRsvpData();
  const stats = useRsvpStats(rsvps);
  const {
    editingRow,
    isSaving,
    validationErrors,
    startEditing,
    cancelEditing,
    updateEditingRow,
    validateEditingRow,
    handleEditSubmit,
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

  return (
    <div className="min-h-screen bg-palette-beige">
      <nav className="max-w-64 ml-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16 items-center gap-4">
          <Button onClick={logout}>Odhlásit se</Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
        formData={editingRow?.formData || {
          names: [],
          attending: "",
          accommodation: "",
          drinkChoice: "",
          customDrink: "",
          dietaryRestrictions: "",
          message: "",
        }}
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
