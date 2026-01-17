import type { RsvpSubmission } from "@/app/lib/types";
import { RsvpTableRow } from "@/app/components/admin/RsvpTableRow";

interface RsvpTableProps {
  deletingId: string | null;
  onDelete: (id: string) => void;
  onEdit: (rsvp: RsvpSubmission) => void;
  rsvps: RsvpSubmission[];
}

const TABLE_HEADERS = [
  { className: "px-6", label: "Jméno účastníka" },
  { className: "px-6", label: "Účast" },
  { className: "px-6", label: "Ubytování" },
  { className: "px-6", label: "Nápoj" },
  { className: "px-4 text-center", label: "Děti" },
  { className: "px-4 text-center", label: "Zvířátka" },
  { className: "px-4", label: "Omezení" },
  { className: "px-4", label: "Zpráva" },
  { className: "px-6", label: "Datum" },
  { className: "px-2", label: "Akce" },
] as const;

export const RsvpTable = ({
  deletingId,
  onDelete,
  onEdit,
  rsvps,
}: RsvpTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header.label}
                  className={`py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase ${header.className}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
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
