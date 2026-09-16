import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { GeographyDataset } from "../source.config";

export async function ensureRawDataset(
  dataset: GeographyDataset,
  rootDir: string,
): Promise<string> {
  const localPath = path.resolve(rootDir, dataset.localPath);
  await mkdir(path.dirname(localPath), { recursive: true });

  try {
    const { access } = await import("node:fs/promises");
    await access(localPath);
    return localPath;
  } catch {
    // Missing locally — fetch below.
  }

  const response = await fetch(dataset.url);
  if (!response.ok) {
    throw new Error(
      `Failed to download ${dataset.name}: ${response.status} ${response.statusText}`,
    );
  }

  const body = await response.text();
  await writeFile(localPath, body, "utf8");
  return localPath;
}
