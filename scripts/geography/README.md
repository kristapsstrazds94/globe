# Geography preprocessing

Build-time scripts that convert raw country boundary datasets into a runtime-efficient representation.

Pipeline (see `docs/GEOGRAPHY.md`):

```text
Raw dataset → validation → simplification → coordinate normalization → runtime format
```

Scripts are added in milestone 2 (T021+). Raw geographic data must not ship to the browser.
