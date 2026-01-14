import type { RsvpStats } from "@/app/hooks/useRsvpStats";
import { getDrinkLabel, getAccommodationLabel } from "@/app/lib/formatters";

interface RsvpStatsCardsProps {
  stats: RsvpStats;
}

export const RsvpStatsCards = ({ stats }: RsvpStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Celkem přítomných
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {stats.totalAttending}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Nápoje
        </h3>
        <div className="space-y-2">
          {Object.entries(stats.drinkCounts).map(([drink, count]) => (
            <div key={drink} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {getDrinkLabel(drink, null)}
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {count}
              </span>
            </div>
          ))}
          {Object.keys(stats.drinkCounts).length === 0 && (
            <p className="text-sm text-gray-500">Zatím žádné odpovědi</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Ubytování
        </h3>
        <div className="space-y-2">
          {Object.entries(stats.accommodationCounts).map(
            ([accommodation, count]) => (
              <div
                key={accommodation}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-gray-700">
                  {getAccommodationLabel(accommodation)}
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {count}
                </span>
              </div>
            )
          )}
          {Object.keys(stats.accommodationCounts).length === 0 && (
            <p className="text-sm text-gray-500">Zatím žádné odpovědi</p>
          )}
        </div>
      </div>
    </div>
  );
};
