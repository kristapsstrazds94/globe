/** Normalize Natural Earth ADM0_A3 to a stable three-letter country id. */
export function normalizeCountryId(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }

  const id = raw.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(id)) {
    return null;
  }

  return id;
}

/** Trim display name; empty strings become null. */
export function normalizeCountryName(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }

  const name = raw.trim();
  return name.length > 0 ? name : null;
}
