import type { Timestamp } from "firebase-admin/firestore";

/** Convert Firestore Timestamp | Date | undefined into a JS Date */
export function toDateSafe(value?: Date | Timestamp | null): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if ((value as Timestamp).toDate) return (value as Timestamp).toDate();
  return new Date();
}
