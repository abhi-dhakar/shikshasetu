export const DEMO_STATUSES = [
  "new",
  "contacted",
  "scheduled",
  "completed",
  "cancelled",
] as const;

export const TUTOR_STATUSES = [
  "received",
  "screening",
  "approved",
  "rejected",
] as const;

export const MESSAGE_STATUSES = ["unread", "read", "replied", "archived"] as const;

export type DemoStatus = (typeof DEMO_STATUSES)[number];
export type TutorStatus = (typeof TUTOR_STATUSES)[number];
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];
