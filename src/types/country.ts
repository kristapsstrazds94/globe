/**
 * Verified country metadata. Geometry references `id` only — see docs/ARCHITECTURE.md.
 */
export type Country = {
  id: string;
  name: string;
  isoA2: string;
  aliases?: readonly string[];
  region?: string;
  capital?: string;
};
