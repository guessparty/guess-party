# guess-party

Plateforme multi-tenant de jeux de devinettes personnalisés (Wordle-style "guess the person" game).

## Cursor Cloud specific instructions

### Repository shape
- Yarn **classic v1** monorepo (`yarn.lock` is `lockfile v1`). Dependencies install into `node_modules` despite the committed `.pnp.cjs` (that PnP file is not used by classic Yarn). Just run `yarn install`.
- Only one workspace currently exists: `apps/tenant-app` — a Vite + React 18 SPA. The root scripts `dev:landing-b2c` and `dev:landing-b2b` reference workspaces that do not exist yet and will fail.

### Run / build (tenant-app)
- Dev server: `yarn dev:tenant` → Vite on port `3000` (`host: true`). See `apps/tenant-app/vite.config.js`.
- Build: `yarn workspace @guess-party/tenant-app build`.
- Note: `yarn build:all` uses `yarn workspaces foreach`, which is a **Yarn Berry** command and is NOT available under classic Yarn v1 — it fails. Build the workspace directly instead.

### Lint / test
- No tests are configured.
- `eslint`/`prettier` are root devDependencies but there is **no ESLint config file**, so running `eslint` errors with "couldn't find an eslint.config file". Lint is effectively not set up.

### Non-obvious gotcha: game data lives in browser localStorage
- The daily game reads people from `localStorage` key `guess-party-persons`, which is populated through the Admin page at `/admin`. `src/data/mockPersons.js` is unused dead data.
- A fresh browser/profile has **no persons**, so the daily/marathon games show nothing until you add at least one person via `/admin`. Add persons there first when manually testing the game flow.
