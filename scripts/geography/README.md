# Geography preprocessing

Build-time scripts that convert raw country boundary datasets into a runtime-efficient representation.

## Source

Dataset selection is documented in `docs/GEOGRAPHY.md` and codified in `source.config.ts`:

- **Natural Earth 5.1.1** — Admin 0 – Countries (1:50m primary, 1:110m optional low detail)
- Primary ID: `ADM0_A3`
- Raw files: `raw/ne_50m_admin_0_countries.geojson` (downloaded, gitignored)

## Pipeline (T021)

```text
Raw GeoJSON → validate → extract required properties → simplify → normalize IDs → runtime JSON
```

Output: `public/generated/geography/countries.json` — compact lon/lat geometry only. Raw GeoJSON must not ship to the browser.

## Commands

```bash
# Download raw Natural Earth GeoJSON (if missing locally)
pnpm geography:fetch

# Full preprocess — fetch when needed, simplify, write runtime bundle
pnpm geography:build
```

From a clean checkout, `pnpm geography:build` downloads the primary dataset when `scripts/geography/raw/` is empty, then writes the generated bundle. Re-running produces deterministic output (sorted features, fixed coordinate precision, fixed simplify tolerance).

Configuration: `preprocess.config.ts` (tolerance, output path).
