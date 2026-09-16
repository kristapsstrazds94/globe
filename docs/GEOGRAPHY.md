# Geographic Data

## Requirements

The globe requires accurate country boundaries and stable country identifiers.

Recommended source family: Natural Earth country/admin-0 boundaries or another appropriately licensed authoritative geographic dataset.

The exact dataset/version must be recorded before implementation.

## Selected source (T020)

**Provider:** [Natural Earth](https://www.naturalearthdata.com/)  
**Theme:** Admin 0 – Countries  
**Version:** 5.1.1 (May 2022)  
**License:** [Public Domain](https://www.naturalearthdata.com/about/terms-of-use/) — no permission required; attribution optional but appreciated (`Made with Natural Earth.`).

Machine-readable config: `scripts/geography/source.config.ts`.

### Primary dataset

| Field | Value |
| --- | --- |
| Scale / resolution | **1:50m** (~50 km) |
| File | `ne_50m_admin_0_countries.geojson` |
| Download URL | https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.1/geojson/ne_50m_admin_0_countries.geojson |
| Local checkout path | `scripts/geography/raw/ne_50m_admin_0_countries.geojson` |
| Format | GeoJSON (WGS84 lon/lat) |
| Approx. features | 258 map units |
| Approx. size | ~800 KB uncompressed |

### Optional low-detail tier

For constrained devices or future adaptive quality (see `docs/PERFORMANCE.md`):

| Field | Value |
| --- | --- |
| Scale / resolution | **1:110m** (~110 km) |
| File | `ne_110m_admin_0_countries.geojson` |
| Download URL | https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.1/geojson/ne_110m_admin_0_countries.geojson |

The preprocessing pipeline (T021+) starts with the **50m** tier unless a task explicitly targets multi-resolution output.

### Stable country identifiers

| Role | Source property | Notes |
| --- | --- | --- |
| **Primary runtime ID** | `ADM0_A3` | Natural Earth three-letter code; always populated (no `-99` sentinel). Used as `Country.id` and geometry keys. |
| External metadata join | `ISO_A3_EH` | ISO 3166-1 alpha-3 with France/Norway repaired; use when joining third-party ISO-coded data. |
| Display label | `NAME` | Short cartographic name — **not** a primary key. |
| Long name | `NAME_LONG` | Canonical long-form label where it differs from `NAME`. |
| Region | `CONTINENT`, `SUBREGION` | UN-aligned regional grouping from source. |

Do not use raw `ISO_A3` or `ISO_A2` as primary keys — they contain `-99` for France, Norway, Kosovo, Northern Cyprus, and Somaliland.

### Geometry support

- Input types: `Polygon`, `MultiPolygon` (GeoJSON native).
- Coordinates: WGS84 decimal degrees (`longitude`, `latitude`).
- Holes: supported via GeoJSON ring orientation (preprocessing must preserve interior rings).

### What counts as a “country”

This product uses Natural Earth **Admin 0 – Countries** (map units), not the separate “sovereign states” theme:

- Metropolitan/homeland units at country granularity.
- **Greenland** is separate from **Denmark**.
- French overseas regions (e.g. Réunion, Guadeloupe) are **not** separate units in this theme — use the “map units” theme only if that product decision changes later.
- Dependencies and semi-independent areas appear when Natural Earth treats them as distinct map units (see `TYPE` in source properties).

### Disputed territories and boundaries

- Natural Earth draws **de facto** boundaries (who controls the territory on the ground), not de jure claims.
- Disputed areas may appear merged with the administering unit.
- Alternative political views are available in Natural Earth’s separate [disputed areas](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-disputed/) theme — not included by default.
- The globe does not take a editorial stance beyond the chosen source convention; document any future overlay in this file.

### Known limitations

- Coastlines and islands are generalized at 50m; tiny islands may be absent until a higher-resolution tier is added.
- Antimeridian-spanning polygons (Russia, Fiji, United States, etc.) need build-time splitting or normalization before sphere tessellation.
- Thematic fields in the source (population, GDP) are vintage estimates — **verified product metadata must come from a separate, documented source** (future task).
- Simplification tolerance for runtime geometry is chosen in T021; do not ship raw GeoJSON to the browser.

### Attribution

Attribution is **not required** by the Natural Earth license. Optional credit: `Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com.`

Raw GeoJSON downloads are gitignored under `scripts/geography/raw/`; the T021 pipeline will fetch or expect them locally.

## Geometry model

Input:

- longitude, latitude

Output:

- x, y, z

For a sphere of radius R, a common formulation is:

```text
lat = latitude in radians
lon = longitude in radians

x = R * cos(lat) * cos(lon)
y = R * sin(lat)
z = R * cos(lat) * sin(lon)
```

Coordinate orientation may be changed to match the scene convention. The conversion must be consistent everywhere.

## Edge cases

Explicitly test:

- north pole
- south pole
- equator
- prime meridian
- antimeridian
- countries crossing the antimeridian
- MultiPolygon countries
- islands
- tiny islands
- holes in polygons

## Geometry preprocessing

Do not perform expensive GeoJSON processing in the browser.

Build-time pipeline:

```text
source.geojson/topojson
        ↓
validate
        ↓
select required properties
        ↓
simplify geometry
        ↓
normalize IDs
        ↓
convert/encode runtime format
        ↓
public/generated/
```

## Simplification

Use a tolerance appropriate to globe viewing distance.

Do not use one extreme simplification blindly.

If zoom levels require more detail later, generate multiple levels:

- country-low
- country-medium
- country-high

## Country identity

Choose a stable identifier.

Do not use display names as primary IDs because names can vary.

Store:

- stable ID
- canonical name
- aliases
- region where verified

## Metadata

Keep geometry separate from metadata.

Example:

```text
geometry.countryId → "NO"

metadata["NO"] → {
  name: "Norway",
  ...
}
```

This prevents large metadata objects from being duplicated inside geometry.

## Rendering strategy

Start with separate country meshes if it keeps implementation simple and performance is acceptable.

Measure before moving to:

- batching
- instancing
- custom picking passes
- geometry atlases

## Visual correctness

A country boundary must sit on the sphere surface with a small controlled offset.

Avoid:

- z-fighting
- obvious floating
- visible seams caused by coordinate conversion
- inverted polygons
- missing holes

## Borders

Borders should not require a giant number of high-cost line objects.

Choose the simplest method that produces acceptable quality at supported DPRs.

## Territories and political boundaries

The product must explicitly define what it means by "country."

Do not silently mix:

- sovereign states
- dependencies
- territories
- disputed regions

Document the chosen convention.

## Data updates

If geographic data changes:

- update source/version documentation
- rerun preprocessing
- inspect geometry
- run geographic tests
- visually inspect representative edge cases
- update metadata if needed
