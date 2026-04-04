import { describe, it, expect } from 'vitest';
import {
  formatFileSize,
  formatDuration,
  formatDate,
  formatMeasurement,
} from '@/utils/format';

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats bytes below 1 KB', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats kilobytes with one decimal', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('formats megabytes with one decimal', () => {
    expect(formatFileSize(2_500_000)).toBe('2.4 MB');
  });

  it('returns "0 B" for negative values', () => {
    expect(formatFileSize(-100)).toBe('0 B');
  });

  it('formats exact 1 KB', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
  });
});

describe('formatDuration', () => {
  it('formats 0 seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('formats seconds under a minute', () => {
    expect(formatDuration(5)).toBe('0:05');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('formats hours, minutes, and seconds', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('returns "0:00" for negative values', () => {
    expect(formatDuration(-10)).toBe('0:00');
  });

  it('pads single-digit minutes when hours are present', () => {
    expect(formatDuration(3600)).toBe('1:00:00');
  });
});

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2025-01-15T10:30:00Z');
    expect(result).toBe('Jan 15, 2025');
  });

  it('returns the input as-is for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });

  it('returns the input as-is for an empty string', () => {
    expect(formatDate('')).toBe('');
  });
});

describe('formatMeasurement', () => {
  it('formats meters with two decimals', () => {
    expect(formatMeasurement(1.234, 'm')).toBe('1.23 m');
  });

  it('converts small values to millimeters', () => {
    expect(formatMeasurement(0.005, 'm')).toBe('5.0 mm');
  });

  it('converts sub-meter values to centimeters', () => {
    expect(formatMeasurement(0.5, 'm')).toBe('50.0 cm');
  });

  it('formats non-meter units with two decimals', () => {
    expect(formatMeasurement(3.14159, 'ft')).toBe('3.14 ft');
  });

  it('treats the boundary at exactly 0.01 m as centimeters', () => {
    expect(formatMeasurement(0.01, 'm')).toBe('1.0 cm');
  });
});
