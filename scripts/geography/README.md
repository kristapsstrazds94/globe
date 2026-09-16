# Geography preprocessing

Build-time scripts that convert raw country boundary datasets into a runtime-efficient representation.

## Source

Dataset selection is documented in `docs/GEOGRAPHY.md` and codified in `source.config.ts`:

- **Natural Earth 5.1.1** — Admin 0 – Countries (1:50m primary, 1:110m optional low detail)
- Primary ID: `ADM0_A3`
- Raw files: `raw/ne_50m_admin_0_countries.geojson` (downloaded, gitignored)

## Pipeline (T021+)

See `docs/GEOGRAPHY.md`:

```text
Raw dataset → validation → simplification → coordinate normalization → runtime format
```

Raw geographic data must not ship to the browser.
