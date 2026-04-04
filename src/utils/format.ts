/**
 * Format a byte count into a human-readable file size string.
 *
 * @example formatFileSize(1536) // "1.5 KB"
 * @example formatFileSize(2_500_000) // "2.4 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  // Show decimals only for KB and above
  const formatted = unitIndex === 0 ? value.toString() : value.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
}

/**
 * Format a duration in seconds into a human-readable string.
 *
 * @example formatDuration(65) // "1:05"
 * @example formatDuration(3661) // "1:01:01"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0:00';

  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedSecs = secs.toString().padStart(2, '0');

  if (hrs > 0) {
    const paddedMins = mins.toString().padStart(2, '0');
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }

  return `${mins}:${paddedSecs}`;
}

/**
 * Format an ISO date string into a localized display string.
 *
 * @example formatDate("2025-01-15T10:30:00Z") // "Jan 15, 2025"
 */
export function formatDate(iso: string): string {
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/**
 * Format a number with commas for readability.
 *
 * @example formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Format a measurement value with appropriate precision.
 *
 * @example formatMeasurement(1.234, 'm') // "1.23 m"
 * @example formatMeasurement(0.005, 'm') // "5.0 mm"
 */
export function formatMeasurement(value: number, unit: string): string {
  if (unit === 'm' && value < 0.01) {
    return `${(value * 1000).toFixed(1)} mm`;
  }
  if (unit === 'm' && value < 1) {
    return `${(value * 100).toFixed(1)} cm`;
  }
  return `${value.toFixed(2)} ${unit}`;
}
