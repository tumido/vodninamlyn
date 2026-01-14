import { ACCOMMODATION_LABELS, DRINK_LABELS } from "./constants";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("cs-CZ", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getAccommodationLabel = (accommodation: string | null) =>
  accommodation
    ? ACCOMMODATION_LABELS[
        accommodation as keyof typeof ACCOMMODATION_LABELS
      ] || accommodation
    : "-";

export const getDrinkLabel = (drink: string | null, customDrink: string | null) => {
  if (!drink) return "-";
  if (drink === "other") return customDrink || "Jiné";
  return DRINK_LABELS[drink as keyof typeof DRINK_LABELS] || drink;
};
