import { type ClassValue, clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a consistent format
 * @param dateString ISO date string or GA4 date format (YYYYMMDD)
 * @param includeYear Whether to include the year in the formatted date
 * @returns Formatted date string
 */
export function formatChartDate(
  dateString: string,
  includeYear = true
): string {
  // Check if the date is in GA4 format (YYYYMMDD)
  if (dateString.length === 8 && !dateString.includes('-')) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    dateString = `${year}-${month}-${day}`;
  }

  return format(parseISO(dateString), includeYear ? 'MMM d, yyyy' : 'MMM d');
}
