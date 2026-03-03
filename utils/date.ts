const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export type DateFormat = 'short' | 'long';

export function formatDate(dateString: string, format: DateFormat = 'short'): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (format === 'long') {
    return `${DAYS[date.getDay()]}, ${MONTHS_FULL[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
