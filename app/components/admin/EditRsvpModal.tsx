import { Modal } from "@/app/components/ui/Modal";
import { RSVPForm } from "@/app/components/forms/RSVPForm";
import type { RSVPFormData } from "@/app/lib/types";

interface EditRsvpModalProps {
  isOpen: boolean;
  rsvpName: string;
  formData: RSVPFormData;
  errors: Record<string, string>;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (formData: RSVPFormData) => void;
  onValidate: () => boolean;
}

export const EditRsvpModal = ({
  isOpen,
  rsvpName,
  formData,
  errors,
  isSaving,
  onClose,
  onSubmit,
  onChange,
  onValidate,
}: EditRsvpModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <RSVPForm
        formData={formData}
        errors={errors}
        isSubmitting={isSaving}
        submitStatus="idle"
        onSubmit={onSubmit}
        onChange={onChange}
        onValidate={onValidate}
        editMode={true}
        editModeRsvpName={rsvpName}
        onCancel={onClose}
        submitLabel={isSaving ? "Ukládání..." : "Uložit"}
      />
    </Modal>
  );
};
