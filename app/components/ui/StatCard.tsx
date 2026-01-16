interface StatCardProps {
  title: string;
  stats: Record<string, number>;
  getLabel: (key: string) => string;
  emptyMessage?: string;
}

export const StatCard = ({
  title,
  stats,
  getLabel,
  emptyMessage = "Zatím žádné odpovědi",
}: StatCardProps) => {
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const hasData = Object.keys(stats).length > 0;
  const sortedStats = Object.entries(stats).sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {sortedStats.map(([key, count], index) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={key} className="group">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm  text-gray-700 ">
                  {getLabel(key)}
                </span>
                <span className="text-base font-bold text-palette-dark-green tabular-nums">
                  {count}
                </span>
              </div>
              <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gray-500/20 rounded-full w-full" />
                <div
                  className="absolute top-0 left-0 h-full bg-palette-orange rounded-full animate-slide-in-from-left"
                  style={{
                    width: `${percentage}%`,
                    animationDelay: `${index * 100}ms`,
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
