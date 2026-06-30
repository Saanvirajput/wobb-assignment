/**
 * Formats a large number into a compact, human-readable string.
 * 1_250_000 -> "1.3M", 12_400 -> "12.4K", 980 -> "980"
 */
export function formatCompact(count: number): string {
  if (!Number.isFinite(count)) return "0";
  if (count >= 1_000_000) {
    return trimZero((count / 1_000_000).toFixed(1)) + "M";
  }
  if (count >= 1_000) {
    return trimZero((count / 1_000).toFixed(1)) + "K";
  }
  return count.toString();
}

/** Formats an engagement ratio (e.g. 0.0234) as a percentage string ("2.34%"). */
export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null || !Number.isFinite(rate)) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

function trimZero(value: string): string {
  return value.endsWith(".0") ? value.slice(0, -2) : value;
}
