import type { RsvpStats } from "@/app/hooks/useRsvpStats";
import { getDrinkLabel, getAccommodationLabel } from "@/app/lib/formatters";
import { StatCard } from "@/app/components/ui/StatCard";

interface RsvpStatsCardsProps {
  stats: RsvpStats;
}

export const RsvpStatsCards = ({ stats }: RsvpStatsCardsProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title="Celkem přítomných"
        stats={{
          Děti: stats.totalChildren,
          Dospělí: stats.totalAttending,
          Zvířátka: stats.totalPets,
        }}
        getLabel={(key) => key}
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
