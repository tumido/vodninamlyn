/**
 * Generic utility to count occurrences of field values in an array
 */
export function countByField<T>(
  items: T[],
  fieldGetter: (item: T) => string | null | undefined
): Record<string, number> {
  const counts: Record<string, number> = {};

  items.forEach((item) => {
    const value = fieldGetter(item);
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  return counts;
}
