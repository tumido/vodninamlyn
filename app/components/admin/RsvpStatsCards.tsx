import type { RsvpStats } from "@/app/hooks/useRsvpStats";
import { getDrinkLabel, getAccommodationLabel } from "@/app/lib/formatters";
import { StatCard } from "@/app/components/ui/StatCard";

interface RsvpStatsCardsProps {
  stats: RsvpStats;
}

export const RsvpStatsCards = ({ stats }: RsvpStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard
        title="Celkem přítomných"
        stats={{ total: stats.totalAttending }}
        getLabel={() => ""}
        variant="total"
        suffix="hostů"
      />

      <StatCard
        title="Nápoje"
        stats={stats.drinkCounts}
        getLabel={(drink) => getDrinkLabel(drink, null)}
      />

      <StatCard
        title="Ubytování"
        stats={stats.accommodationCounts}
        getLabel={getAccommodationLabel}
      />
    </div>
  );
};
