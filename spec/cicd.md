# spec: CI/CD

> Scope: GitHub Actions pipeline, Dependabot configuration, and deployment trigger strategy.

---

## 1. Principles

- Every pull request runs the full test suite before merge
- Every commit on `main` — regardless of origin — runs the full test suite
- Dependabot keeps dependencies up to date; its PRs are subject to the same pipeline as any other PR and auto-merge if tests pass
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

1. **Checkout** — `actions/checkout@v4`
2. **Setup Node.js** — `actions/setup-node@v4`, version `22`, with `npm` cache
3. **Install dependencies** — `npm ci`
4. **Cache Playwright browsers** — `actions/cache@v4`, key on `package-lock.json` hash
5. **Install Playwright browsers** — `chromium` only, skipped on cache hit (system deps still installed)
6. **Lint and format** — `npm run check` (Biome — blocks on lint or format errors)
7. **Build** — `npm run build` (includes `astro-compress` minification)
8. **Test** — `npx playwright test --reporter=github,html` (all suites; `github` reporter annotates PRs inline)
9. **Upload Playwright report** — `actions/upload-artifact@v4`, only on failure, `retention-days: 7`

All steps run sequentially. A failure at any step aborts the workflow.

### `dependabot-automerge.yml` — auto-merge

Runs on: `pull_request` from `dependabot[bot]`.

Steps:

1. **Enable auto-merge** — `gh pr merge --auto --squash` via `GITHUB_TOKEN`

Auto-merge activates once all required status checks (i.e. `ci`) pass. GitHub enforces this — the merge does not happen immediately on workflow trigger.

---

## 4. Dependabot

**File:** `.github/dependabot.yml`

Dependabot monitors `npm` dependencies and opens pull requests for updates weekly.

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore(deps)"
```

Auto-merge applies to all Dependabot PRs — patch, minor, and major. If a major update breaks the build or tests, the pipeline blocks the merge naturally.

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
