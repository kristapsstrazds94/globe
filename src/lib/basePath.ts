const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** GitHub Pages subpath prefix, e.g. `/globe`. Empty for local dev and user sites. */
export const basePath = rawBasePath.endsWith("/") ? rawBasePath.slice(0, -1) : rawBasePath;

/** Prefix an absolute public asset path with the configured base path. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    return `${basePath}/${path}`;
  }

  return `${basePath}${path}`;
}
