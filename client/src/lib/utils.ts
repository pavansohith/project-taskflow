import { clsx, type ClassValue } from "clsx";
import {
  format,
  formatDistanceToNow,
  isSameDay,
  isValid,
  parseISO,
} from "date-fns";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  pattern = "MMM d, yyyy"
): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "—";
  return format(parsed, pattern);
}

export function formatRelativeDate(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "—";
  return formatDistanceToNow(parsed, { addSuffix: true });
}

export function formatMemberSince(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "—";
  return format(parsed, "MMMM yyyy");
}

export function formatLastSeen(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "—";
  if (isSameDay(parsed, new Date())) {
    return `Today at ${format(parsed, "h:mm a")}`;
  }
  return format(parsed, "MMM d, yyyy h:mm a");
}
