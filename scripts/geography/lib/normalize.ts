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

/** Normalize ISO 3166-1 alpha-2 codes from Natural Earth ISO_A2_EH. */
export function normalizeIsoAlpha2(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }

  const code = raw.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    return null;
  }

  return code;
}

/** Trim display name; empty strings become null. */
export function normalizeCountryName(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }

  const name = raw.trim();
  return name.length > 0 ? name : null;
}
