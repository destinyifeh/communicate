/**
 * Date utilities
 */

/** Get start of day (00:00:00) */
export function startOfDay(date: Date | string): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get end of day (23:59:59) */
export function endOfDay(date: Date | string): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Add days to a date */
export function addDays(date: Date | string, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Parse date range from query params */
export function parseDateRange(startDate?: string, endDate?: string) {
  return {
    startDate: startDate ? startOfDay(startDate) : undefined,
    endDate: endDate ? endOfDay(endDate) : undefined,
  };
}
