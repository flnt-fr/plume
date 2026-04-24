# spec: CI/CD

> Scope: GitHub Actions pipeline, Dependabot configuration, and deployment trigger strategy.

---

## 1. Principles

- Every pull request runs the full test suite before merge
- Every commit on `main` — regardless of origin — runs the full test suite
- Dependabot keeps dependencies up to date; its PRs are subject to the same pipeline as any other PR and must be reviewed and merged manually
- All GitHub Actions are pinned to a commit SHA (not a tag) to prevent supply chain attacks; Dependabot keeps those SHAs up to date
- Artifacts are retained for **7 days** maximum — enough to investigate a failure, no long-term storage

---

## 2. Triggers

### Pull requests

All pull requests targeting `main` trigger the `ci` workflow. This applies to Dependabot PRs and manual PRs alike.

### Push to main

Every push to `main` (including merges) triggers the `ci` workflow.

---

## 3. Workflows

### `ci.yml` — lint, build, test

Runs on: `pull_request` targeting `main`, `push` to `main`.

Steps in order:

1. **Checkout** — `actions/checkout`, pinned by SHA
2. **Setup Node.js** — `actions/setup-node`, version `22`, with `npm` cache, pinned by SHA
3. **Install dependencies** — `npm ci`
4. **Cache Playwright browsers** — `actions/cache`, key on `package-lock.json` hash, pinned by SHA
5. **Install Playwright browsers** — `chromium` only, skipped on cache hit (system deps still installed)
6. **Lint and format** — `npm run check` (Biome — blocks on lint or format errors)
7. **Build** — `npm run build` (includes `astro-compress` minification)
8. **Test** — `npx playwright test --reporter=github,html` (all suites; `github` reporter annotates PRs inline)
9. **Upload Playwright report** — `actions/upload-artifact`, only on failure, `retention-days: 7`, pinned by SHA

All steps run sequentially. A failure at any step aborts the workflow.

---

## 4. Dependabot

**File:** `.github/dependabot.yml`

Dependabot monitors both `npm` packages and `github-actions` used in workflows. It opens pull requests for updates weekly. PRs are never auto-merged — they require manual review before merge.

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore(deps)"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore(deps)"
```

The `github-actions` ecosystem monitors SHA-pinned actions in workflow files and opens PRs when a newer commit SHA is available for the same tag.

---

## 5. Artifacts

| Artifact | Workflow | Condition | Retention |
|---|---|---|---|
| `playwright-report` | `ci` | on failure only | 7 days |

No build artifacts (`dist/`) are stored — the site is deployed via Coolify webhook, not by pushing files.

---

## 6. Out of scope

- Deployment — not configured yet
- Staging environment or preview deployments per PR
- Manual approval gates before deployment
- Notifications (Slack, email) on failure
