# Geographic Data

## Requirements

The globe requires accurate country boundaries and stable country identifiers.

Recommended source family: Natural Earth country/admin-0 boundaries or another appropriately licensed authoritative geographic dataset.

The exact dataset/version must be recorded before implementation.

## Source documentation

Record:

- source name
- URL
- version/release date
- license
- resolution
- whether disputed territories are represented
- whether dependencies require attribution

Do not leave this as an undocumented dependency.

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
