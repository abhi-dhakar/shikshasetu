export type FieldErrors = Record<string, string>;

export function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isPhone(value: string): boolean {
  return /^[0-9]{10}$/.test(value.replace(/\D/g, "")) && /^[6-9]/.test(value.replace(/\D/g, ""));
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export function required(
  errors: FieldErrors,
  key: string,
  value: string,
  label: string,
  max = 240,
) {
  if (!value) {
    errors[key] = `${label} is required.`;
  } else if (value.length > max) {
    errors[key] = `${label} must be under ${max} characters.`;
  }
}

/** Formats a Date into YYYY-MM-DD using local time. */
export function toIsoDate(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
