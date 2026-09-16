# World Globe

Interactive 3D world globe for the web. The globe is the hero — UI supports exploration without obscuring Earth.

## Local setup

**Requirements:** Node.js 20 or newer, pnpm 9+

### Install pnpm

Pick one option:

```bash
# Option A — Corepack (works when Node is user-installed, or run terminal as Administrator on Windows)
corepack enable
corepack prepare pnpm@10.17.0 --activate

# Option B — npm global install (no admin needed on most setups)
npm install -g pnpm@10.17.0

# Option C — Windows PowerShell standalone installer
# iwr https://get.pnpm.io/install.ps1 -useb | iex
```

On Windows, `corepack enable` often fails with `EPERM` when Node.js lives under `C:\Program Files\nodejs`. Use **Option B** or **Option C** instead, or run your terminal as Administrator once for Option A.

### Run the app

```bash
# Install dependencies (uses pnpm-lock.yaml for reproducible installs)
pnpm install --frozen-lockfile

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the World Globe placeholder page.

### Quality commands

```bash
pnpm lint          # ESLint
pnpm typecheck     # TypeScript (strict)
pnpm test          # Unit tests (Vitest)
pnpm format:check  # Prettier
pnpm build         # Production build
pnpm start         # Serve production build (after build)
pnpm geography:build  # Preprocess country boundaries (build-time)
pnpm perf:measure     # Capture performance baseline snapshot (T060+)
```

Use `pnpm install` (without `--frozen-lockfile`) when adding or updating dependencies.

### Continuous integration

GitHub Actions runs the same baseline checks on every push and pull request to `main`:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm typecheck`
4. `pnpm test`
5. `pnpm build`

The workflow lives at `.github/workflows/ci.yml` and does not require secrets for these checks.

## Project structure

Source layout follows `docs/ARCHITECTURE.md`:

```text
src/
  app/                 # Next.js routes and global styles
  components/
    globe/             # R3F/Three.js rendering (client boundary)
    ui/                # DOM UI — search, panels, tooltips, shell
  data/                # Runtime country metadata and geography bundles
  stores/              # Zustand application state
  lib/
    geo/               # Coordinate and geometry utilities
    search/            # Country search helpers
  types/               # Shared TypeScript types
  tests/               # Integration / cross-module tests
scripts/
  geography/           # Build-time geographic preprocessing
```

Rendering (`components/globe`) and DOM UI (`components/ui`) are separate. Shared types live in `src/types/`. Module imports flow downward — types and lib must not import from components.

## Product goal

Build a premium, responsive, interactive 3D world globe.

Core interaction:

- Rotate the globe with pointer/touch gestures
- Zoom with wheel/pinch
- Hover countries on pointer-capable devices
- Tap/click countries on all devices
- Show country name and selection state
- Smoothly fly the camera/globe to a selected country
- Provide country search
- Provide accessible non-globe alternatives for navigation and selection
- Remain usable on mobile, tablet, desktop, and reduced-motion environments

## Agent documentation

This repository includes Cursor agent instructions for task-by-task implementation.

Read in order:

1. `AGENTS.md`
2. `TASKS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DESIGN.md`
5. `docs/PERFORMANCE.md`
6. `docs/GEOGRAPHY.md`
7. `docs/TESTING.md`
8. `docs/WORKFLOW.md`

Work task-by-task from `TASKS.md`.

### Source of truth

- `TASKS.md` — execution backlog and status
- `AGENTS.md` — non-negotiable agent rules
- `docs/ARCHITECTURE.md` — technical architecture and boundaries
- `docs/DESIGN.md` — visual system and responsive behavior
- `docs/PERFORMANCE.md` — performance budgets and optimization rules
- `docs/GEOGRAPHY.md` — geographic data pipeline and correctness
- `docs/TESTING.md` — quality gates and test strategy
- `docs/WORKFLOW.md` — implementation workflow and Definition of Done

### Status vocabulary

Every task must use exactly one status: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `DONE`.
