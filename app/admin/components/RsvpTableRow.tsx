import type { RsvpSubmission } from "../../lib/types";
import { Tooltip } from "../../components/ui/Tooltip";
import { ActionButton } from "../../components/ui/ActionButton";
import { ATTENDING_LABELS } from "../lib/constants";
import { formatDate, getAccommodationLabel, getDrinkLabel } from "../lib/formatters";

interface RsvpTableRowProps {
  rsvp: RsvpSubmission;
  onEdit: (rsvp: RsvpSubmission) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const RsvpTableRow = ({
  rsvp,
  onEdit,
  onDelete,
  deletingId,
}: RsvpTableRowProps) => {
  return (
    <tr className="hover:bg-palette-beige/50">
      <td
        className={`px-6 py-4 whitespace-nowrap ${
          !rsvp.is_primary ? "relative" : ""
        }`}
      >
        <div
          className={`text-sm font-medium text-gray-900 flex items-center gap-2 before:border-l-3 before:left-1 before:h-full before:border-l-palette-green ${
            !rsvp.is_primary ? "pl-4 before:absolute" : ""
          }`}
        >
          {rsvp.attendee_name}
          {rsvp.is_primary && (
            <span className="text-xs text-gray-500">(primární)</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            rsvp.attending === "yes"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {ATTENDING_LABELS[rsvp.attending]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {rsvp.attending === "yes"
          ? getAccommodationLabel(rsvp.accommodation)
          : "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {rsvp.attending === "yes"
          ? getDrinkLabel(rsvp.drinkChoice, rsvp.customDrink)
          : "-"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">
        {rsvp.dietaryRestrictions || "-"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">
        <Tooltip content={rsvp.message || ""}>
          <div className="max-w-30 truncate cursor-help">
            {rsvp.message || "-"}
          </div>
        </Tooltip>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(rsvp.created_at)}
      </td>
      <td className="px-2 py-4 whitespace-nowrap text-sm">
        <div className="flex gap-2">
          <ActionButton name="edit" onClick={() => onEdit(rsvp)} />
          {rsvp.is_primary && (
            <ActionButton
              name="delete"
              onClick={() => onDelete(rsvp.attendee_id)}
              disabled={deletingId === rsvp.attendee_id}
            />
          )}
        </div>
      </td>
    </tr>
  );
};
