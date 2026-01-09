/**
 * Formats a date using the user's locale
 * Example (en-US): "Sun, May 10, 2026, 2:00 AM"
 * Example (de-DE): "So., 10. Mai 2026, 02:00"
 * Input: Date object from strings like "2022-02-10T19:48:37Z"
 */
export function formatFixtureDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

/**
 * Formats a date using the user's locale
 * Example (en-US): "06/18/1995"
 * Example (de-DE): "18.06.1995"
 * Input: Date string like "2019-08-09"
 */
export function formatPlayerDate(dateOfBirth: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(dateOfBirth))
}

/**
 * Gets date with offset in YYYY-MM-DD format
 * @param days Number of days offset (positive for future, negative for past)
 */
export function getDateWithOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}
