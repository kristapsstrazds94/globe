import { readFile, readdir, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

import worldCountries from "world-countries";

import { parseFactbookAreaSqKm, roundPercent } from "./parseFactbookArea";

const require = createRequire(import.meta.url);

export type FactbookAreaProfile = {
  totalAreaKm2: number;
  landAreaKm2: number;
  waterAreaKm2: number;
  landAreaPercent: number;
  waterAreaPercent: number;
};

type FactbookCountryFile = {
  Geography?: {
    Area?: {
      total?: { text?: string };
      land?: { text?: string };
      water?: { text?: string };
    };
  };
};

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/^the\s+/u, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function collectFactbookJsonPaths(rootDir: string): Promise<string[]> {
  const paths: string[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory);
    for (const entry of entries) {
      const entryPath = path.join(directory, entry);
      const entryStat = await stat(entryPath);
      if (entryStat.isDirectory()) {
        await walk(entryPath);
        continue;
      }

      if (entry.endsWith(".json")) {
        paths.push(entryPath);
      }
    }
  }

  await walk(rootDir);
  return paths;
}

function parseSummaryNameToGec(summaryText: string): Map<string, string> {
  const nameToGec = new Map<string, string>();

  for (const line of summaryText.split("\n")) {
    const match = line.match(/^`([a-z]{2})`\s+(.+)$/u);
    const gec = match?.[1];
    const name = match?.[2];
    if (!gec || !name) {
      continue;
    }

    nameToGec.set(normalizeName(name), gec);
  }

  return nameToGec;
}

function resolveGecForCountry(
  cca2: string,
  commonName: string,
  officialName: string,
  gecByFileName: ReadonlySet<string>,
  nameToGec: ReadonlyMap<string, string>,
): string | null {
  const direct = cca2.toLowerCase();
  if (gecByFileName.has(direct)) {
    return direct;
  }

  const candidates = [commonName, officialName].map(normalizeName).filter(Boolean);
  for (const candidate of candidates) {
    const gec = nameToGec.get(candidate);
    if (gec) {
      return gec;
    }
  }

  for (const candidate of candidates) {
    for (const [name, gec] of nameToGec.entries()) {
      if (candidate.includes(name) || name.includes(candidate)) {
        return gec;
      }
    }
  }

  return null;
}

function toFactbookAreaProfile(
  totalAreaKm2: number,
  landAreaKm2: number,
  waterAreaKm2: number,
): FactbookAreaProfile {
  const landAreaPercent = roundPercent((landAreaKm2 / totalAreaKm2) * 100);
  const waterAreaPercent = roundPercent((waterAreaKm2 / totalAreaKm2) * 100);

  return {
    totalAreaKm2,
    landAreaKm2,
    waterAreaKm2,
    landAreaPercent,
    waterAreaPercent,
  };
}

export async function loadFactbookAreas(): Promise<{
  areaByIsoA2: Map<string, FactbookAreaProfile>;
}> {
  const factbookRoot = path.dirname(require.resolve("factbook.json/package.json"));
  const jsonPaths = await collectFactbookJsonPaths(factbookRoot);
  const gecByFileName = new Set(jsonPaths.map((filePath) => path.basename(filePath, ".json")));
  const summaryText = await readFile(path.join(factbookRoot, "SUMMARY.md"), "utf8");
  const nameToGec = parseSummaryNameToGec(summaryText);

  const areaByGec = new Map<string, FactbookAreaProfile>();

  for (const filePath of jsonPaths) {
    const gec = path.basename(filePath, ".json");
    const parsed = JSON.parse(await readFile(filePath, "utf8")) as FactbookCountryFile;
    const totalAreaKm2 = parseFactbookAreaSqKm(parsed.Geography?.Area?.total?.text);
    const landAreaKm2 = parseFactbookAreaSqKm(parsed.Geography?.Area?.land?.text);
    const waterAreaKm2 = parseFactbookAreaSqKm(parsed.Geography?.Area?.water?.text);

    if (
      totalAreaKm2 === null ||
      landAreaKm2 === null ||
      waterAreaKm2 === null ||
      landAreaKm2 + waterAreaKm2 > totalAreaKm2 * 1.05
    ) {
      continue;
    }

    areaByGec.set(gec, toFactbookAreaProfile(totalAreaKm2, landAreaKm2, waterAreaKm2));
  }

  const areaByIsoA2 = new Map<string, FactbookAreaProfile>();

  for (const country of worldCountries) {
    const gec = resolveGecForCountry(
      country.cca2,
      country.name.common,
      country.name.official,
      gecByFileName,
      nameToGec,
    );

    if (!gec) {
      continue;
    }

    const profile = areaByGec.get(gec);
    if (profile) {
      areaByIsoA2.set(country.cca2, profile);
    }
  }

  return { areaByIsoA2 };
}
