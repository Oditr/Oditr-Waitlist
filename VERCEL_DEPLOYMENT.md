# Vercel Deployment Notes — Oditr Waitlist Frontend

## Project Structure

```
Oditr-Waitlist/
├── frontend/   ← Deploy this on Vercel
└── backend/    ← Deploy separately (Node/Express)
```

---

## Vercel Settings for Frontend

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Create React App` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install` |

> ⚠️ Do NOT use `--force` or `--legacy-peer-deps` in the Install Command.
> Dependency conflicts have been resolved properly in `package.json`.

---

## Dependency Fixes Applied (2026-06-18)

### Problem
Vercel deployment failed with `ERESOLVE unable to resolve dependency tree` due to two peer dependency conflicts:

1. `date-fns@4.1.0` → `react-day-picker@8.10.1` requires `date-fns@^2.28.0 || ^3.0.0`
2. `react@19.0.0` → `react-day-picker@8.10.1` requires `react@^16.8.0 || ^17.0.0 || ^18.0.0`

### Solution (no `--force`, no `--legacy-peer-deps`)

| Package | Before | After | Reason |
|---|---|---|---|
| `date-fns` | `4.1.0` | `3.6.0` | Compatible with `react-day-picker@8.x` peer dep |
| `react` | `19.0.0` | `18.3.1` | `react-day-picker@8.x` does not support React 19 |
| `react-dom` | `19.0.0` | `18.3.1` | Must match `react` version |
| `packageManager` field | `yarn@1.22.22` | *(removed)* | Was causing conflicts with `npm install` on Vercel |

An `overrides` block was also added to `package.json` to ensure consistent resolution across all transitive dependencies:

```json
"overrides": {
  "date-fns": "3.6.0",
  "react": "18.3.1",
  "react-dom": "18.3.1"
}
```

---

## Build Results

- ✅ `npm install` — **Success** (1498 packages, no ERESOLVE errors)
- ✅ `npm run build` — **Success** (compiled with minor ESLint warnings only)
- Build output: `frontend/build/` (ready to deploy)

### Build Output Sizes
| File | Gzipped Size |
|---|---|
| `build/static/js/main.*.js` | 134.91 kB |
| `build/static/css/main.*.css` | 10.49 kB |

---

## Environment Variables

Set the following in your Vercel project's **Environment Variables** tab:

```
REACT_APP_BACKEND_URL=<your-backend-url>
```

(Check `frontend/.env` for the full list of required variables.)

---

## Notes

- The only build warning is an ESLint `react-hooks/exhaustive-deps` warning in `CustomCursor.jsx` — this is cosmetic and does **not** affect the build.
- The `@emergentbase/visual-edits` dev dependency is only active in development mode (`NODE_ENV !== production`) via the `craco.config.js` guard, so it does not affect the Vercel production build.
