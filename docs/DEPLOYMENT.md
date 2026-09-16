# Deployment — GitHub Pages

The app is built as a **static export** (`next build` → `out/`) and deployed with GitHub Actions.

## Live URL

After setup, the site is available at:

```text
https://<github-username>.github.io/<repo-name>/
```

Example: repo `globe` → `https://jane.github.io/globe/`

## One-time GitHub setup

1. Create a **public** repository on GitHub (name it e.g. `globe`).
2. Push this project to the `main` branch.
3. Open the repo on GitHub → **Settings** → **Pages**.
4. Under **Build and deployment** → **Source**, select **GitHub Actions**.
5. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually from the **Actions** tab).
6. When the workflow succeeds, open the URL shown in the workflow summary.

No secrets are required for the default GitHub Pages deploy.

## How it works

| File                                 | Purpose                                                             |
| ------------------------------------ | ------------------------------------------------------------------- |
| `next.config.ts`                     | `output: "export"`, `basePath`, static image settings               |
| `.github/workflows/deploy-pages.yml` | Builds with `NEXT_PUBLIC_BASE_PATH=/<repo-name>` and uploads `out/` |
| `public/.nojekyll`                   | Disables Jekyll processing on GitHub Pages                          |

The deploy workflow sets `NEXT_PUBLIC_BASE_PATH` from the repository name automatically, so assets resolve correctly under `/<repo-name>/`.

## Local static preview (matches GitHub Pages)

```bash
# PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/globe"   # use your repo name
pnpm build
npx serve out
```

Open `http://localhost:3000/globe/` (port may differ — check the `serve` output).

For everyday development, omit the env var:

```bash
pnpm dev
# → http://localhost:3000
```

## User/org site (optional)

To serve at `https://<username>.github.io/` with no subpath:

1. Rename the repository to `<username>.github.io`.
2. Remove the `NEXT_PUBLIC_BASE_PATH` env block from `.github/workflows/deploy-pages.yml`.
3. Redeploy.

## Custom domain (optional)

1. Repo **Settings** → **Pages** → **Custom domain** → enter your domain.
2. At your DNS provider, add either:
   - **A records** → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, or
   - **CNAME** → `<username>.github.io`
3. Enable **Enforce HTTPS** after DNS propagates.

If the site is served from the domain root (not a subpath), remove `NEXT_PUBLIC_BASE_PATH` from the deploy workflow.

## Troubleshooting

| Symptom                   | Likely cause                                                                    |
| ------------------------- | ------------------------------------------------------------------------------- |
| Blank page, 404 on JS/CSS | Wrong `basePath` — repo name must match `NEXT_PUBLIC_BASE_PATH`                 |
| Deploy workflow missing   | Enable **GitHub Actions** as the Pages source in repo settings                  |
| Build fails in Actions    | Check the **Build static site** step log; run `pnpm build` locally first        |
| Icons or logo missing     | Confirm `public/brand/globe-logo.svg` is committed and metadata uses `basePath` |
