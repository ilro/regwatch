import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, parseISO } from "date-fns";
import { CATEGORY_COLOURS } from "./constants";
import type { Category } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM yyyy");
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy");
}

export function getDaysUntil(date: string | Date): number {
  const d = typeof date === "string" ? parseISO(date) : date;
  return differenceInDays(d, new Date());
}

export function getCategoryColor(category: Category): string {
  return CATEGORY_COLOURS[category] || CATEGORY_COLOURS.other;
}

export function getUrgencyColor(daysUntil: number): string {
  if (daysUntil < 0) return "text-red-600";
  if (daysUntil <= 1) return "text-red-600";
  if (daysUntil <= 7) return "text-amber-600";
  if (daysUntil <= 14) return "text-blue-600";
  return "text-slate-600";
}

export function getUrgencyLabel(daysUntil: number): string {
  if (daysUntil < 0) return `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? "s" : ""}`;
  if (daysUntil === 0) return "Due today";
  if (daysUntil === 1) return "Due tomorrow";
  return `Due in ${daysUntil} days`;
}

export function getFrequencyOffset(frequency: string): number {
  switch (frequency) {
    case "weekly":
      return 7;
    case "fortnightly":
      return 14;
    case "monthly":
      return 30;
    case "quarterly":
      return 90;
    case "annually":
      return 365;
    default:
      return 365;
  }
}
