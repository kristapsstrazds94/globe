# Tests

Home for integration and cross-module tests. Colocated `*.test.ts(x)` files are also used for unit tests (see `docs/TESTING.md`).

Dependency direction (no cycles):

```text
types → lib → data
types → stores
types, stores, lib → components/ui | components/globe
components → app
```
