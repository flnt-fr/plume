# spec: tooling

> Scope: code quality tooling, formatting, linting, and editor configuration.

---

## 1. Principles

Tooling must be minimal and fast. A single tool handles both linting and formatting to avoid conflicts between rules and reduce configuration overhead.

---

## 2. Biome

**Biome** handles linting and formatting for all TypeScript and JavaScript files. It replaces both ESLint and Prettier.

**File:** `biome.json` at the project root.

### Scope

Biome applies to:
- `src/**/*.ts`
- `src/**/*.astro` (JS/TS portions only — Biome does not parse Astro templates)
- `tests/**/*.ts`

Astro template syntax (`.astro` files) is not fully supported by Biome. The TypeScript frontmatter and script blocks are linted; the HTML-like template is not.

### Configuration baseline

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.12/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "css": {
    "parser": { "tailwindDirectives": true },
    "formatter": { "enabled": false },
    "linter": { "enabled": false }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always"
    }
  },
  "overrides": [
    {
      "includes": ["**/*.astro"],
      "linter": {
        "rules": {
          "correctness": {
            "noUnusedVariables": "off",
            "noUnusedImports": "off"
          }
        }
      }
    },
    {
      "includes": ["tests/**"],
      "linter": {
        "rules": {
          "style": {
            "noNonNullAssertion": "off"
          }
        }
      }
    },
    {
      "includes": ["**/*.css"],
      "formatter": { "enabled": false },
      "linter": { "enabled": false }
    },
    {
      "includes": ["*.config.ts", "astro.config.ts"],
      "linter": { "enabled": false }
    }
  ]
}
```

Key overrides:
- **`.astro` files**: `noUnusedVariables` and `noUnusedImports` are disabled — Astro's template syntax uses imports that Biome cannot track
- **`tests/`**: `noNonNullAssertion` is disabled — test code often deals with possibly-null DOM queries
- **CSS files**: formatter and linter disabled — Biome does not lint CSS in this project
- **Config files**: linter disabled — `astro.config.ts` uses patterns (type assertions, dynamic imports) that produce false positives

### Scripts

```json
{
  "scripts": {
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check --write ."
  }
}
```

`check` runs lint + format in one pass and is the canonical command for CI and pre-commit.

---

## 3. TypeScript

**File:** `tsconfig.json`

Strict mode is enabled. No exceptions.

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`noUncheckedIndexedAccess` is added on top of Astro's strict preset — it forces explicit handling of potentially undefined array and object accesses, which is particularly relevant when consuming content collections.

The `@/` alias maps to `src/` and is the canonical import path across the entire project. Example: `import { ui } from '@/i18n'`.

---

## 4. Editor integration

**File:** `.editorconfig`

IntelliJ reads `.editorconfig` natively for basic formatting consistency (indentation, line endings, charset).

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

Biome is available as an IntelliJ plugin (`Biome` by `biomejs`). Once installed, configure it as the default formatter for TypeScript and JavaScript files with format-on-save enabled.

The `.editorconfig` and the Biome plugin together replicate the behaviour of the VS Code setup.

---

## 5. CI integration

The `check` script runs in the `ci.yml` workflow as the first step after dependency installation, before the build:

```yaml
- run: npm run check
```

A formatting or linting violation fails the pipeline before any build or test step.

---

## 6. Out of scope

- Git hooks (Husky, lint-staged) — the CI check is sufficient for this project
- Stylelint — CSS files are minimal and scoped; Biome does not lint CSS