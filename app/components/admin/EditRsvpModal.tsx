import { Modal } from "@/app/components/ui/Modal";
import { RSVPForm } from "@/app/components/forms/RSVPForm";
import type { RSVPFormData } from "@/app/lib/types";

interface EditRsvpModalProps {
  errors: Record<string, string>;
  formData: RSVPFormData;
  isOpen: boolean;
  isSaving: boolean;
  onChange: (formData: RSVPFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onValidate: () => boolean;
  rsvpName: string;
}

export const EditRsvpModal = ({
  errors,
  formData,
  isOpen,
  isSaving,
  onChange,
  onClose,
  onSubmit,
  onValidate,
  rsvpName,
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
