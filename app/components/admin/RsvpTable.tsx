import type { RsvpSubmission } from "@/app/lib/types";
import { RsvpTableRow } from "@/app/components/admin/RsvpTableRow";

interface RsvpTableProps {
  rsvps: RsvpSubmission[];
  onEdit: (rsvp: RsvpSubmission) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const TABLE_HEADERS = [
  { label: "Jméno účastníka", className: "px-6" },
  { label: "Účast", className: "px-6" },
  { label: "Ubytování", className: "px-6" },
  { label: "Nápoj", className: "px-6" },
  { label: "Děti", className: "px-4 text-center" },
  { label: "Zvířátka", className: "px-4 text-center" },
  { label: "Omezení", className: "px-4" },
  { label: "Zpráva", className: "px-4" },
  { label: "Datum", className: "px-6" },
  { label: "Akce", className: "px-2" },
] as const;

export const RsvpTable = ({
  rsvps,
  onEdit,
  onDelete,
  deletingId,
}: RsvpTableProps) => {
  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header.label}
                  className={`text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 ${header.className}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rsvps.map((rsvp) => (
              <RsvpTableRow
                key={rsvp.attendee_id}
                rsvp={rsvp}
                onEdit={onEdit}
                onDelete={onDelete}
                deletingId={deletingId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
