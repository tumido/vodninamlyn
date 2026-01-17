interface StatCardProps {
  emptyMessage?: string;
  getLabel: (key: string) => string;
  stats: Record<string, number>;
  title: string;
}

export const StatCard = ({
  emptyMessage = "Zatím žádné odpovědi",
  getLabel,
  stats,
  title,
}: StatCardProps) => {
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const hasData = Object.keys(stats).length > 0;
  const sortedStats = Object.entries(stats).sort(([, a], [, b]) => b - a);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <h3 className="mb-4 text-sm font-medium tracking-wide text-gray-500 uppercase">
        {title}
      </h3>

      <div className="space-y-3">
        {sortedStats.map(([key, count], index) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={key} className="group">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-gray-700">{getLabel(key)}</span>
                <span className="text-palette-dark-green text-base font-bold tabular-nums">
                  {count}
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="absolute top-0 left-0 h-full w-full rounded-full bg-gray-500/20" />
                <div
                  className="bg-palette-orange animate-slide-in-from-left absolute top-0 left-0 h-full rounded-full"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
        {!hasData && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-400 italic">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};
