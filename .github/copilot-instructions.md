<!-- Copilot / AI agent instructions for contributors and automated agents -->
# FindArtisan — Copilot Instructions

Purpose: Give AI coding agents the focused, project-specific context they need to be immediately productive.

- **Big picture**: This repository contains two main parts:
  - `backend/` — a Strapi v5 application (headless CMS). Entrypoints and config live under `backend/config/` and `backend/src/`.
  - `frontend/` — a Next.js (App Router) TypeScript app in the `app/` folder using Mantine, Tailwind and TanStack Query.

- **Why this structure**: Strapi manages the content model and API surface; the Next frontend consumes that API via services in `frontend/lib/` (see `frontend/lib/api-client.ts`). Runtime configuration for Strapi is environment-driven (`backend/config/server.ts`).

- **Developer workflows (commands to run)**
  - Start backend (development): run in `backend/`
    - `yarn develop` (or `npm run develop`) — uses Strapi's `develop` script.
  - Start frontend (development): run in `frontend/`
    - `yarn dev` (or `npm run dev`) — Next.js dev server on port 3000.
  - Build backend: `yarn build` (runs `strapi build`).
  - Generate backend OpenAPI docs: from `backend/` run `yarn docs:generate` (produces `public/swagger-spec.json`).

- **Environments & constraints**
  - Backend Node engine: `>=18.0.0 <=22.x.x` (see `backend/package.json`). Use the repository's `yarn` setup where possible (`packageManager` fields indicate Yarn v1 usage).
  - Strapi plugins and storage: check `backend/package.json` and `backend/config/*` (MinIO upload provider present: `@avorati/strapi-provider-upload-minio`).

- **Patterns and conventions to follow**
  - Backend: follow Strapi conventions — content-types, controllers, services and routes are under `backend/src` or `backend/**/content-types`. Look at `backend/src/index.ts` and `backend/config/` for lifecycle hooks and config patterns.
  - Frontend: App Router inside `app/`. Reusable UI lives in `app/_components/` and form components under `app/_components/forms/`. API wrappers and services live in `frontend/lib/` (see `frontend/lib/api-client.ts` and `frontend/lib/services`).
  - State: TanStack Query for server state; `zustand` for lightweight client state (stores under `frontend/stores/`).
  - Styling: Tailwind + Mantine. Follow examples in `frontend/app/_components/*` for class and component patterns.
  - Cursor rules: project has an established set of AI/automation rules under `.cursor/rules/` — consult these before adding new automated edits.

- **Integration points**
  - API surface: Strapi REST/GraphQL endpoints configured by content-types and plugins. Frontend consumes via `frontend/lib/api-client.ts`.
  - File uploads: `public/uploads/` and MinIO provider configured in `backend/config`.
  - Database drivers: supports `pg` (Postgres) and `better-sqlite3` — check `backend/package.json` and `backend/database/migrations/` for migration conventions.

- **AI agent guidance (what to do first)**
  1. Read `frontend/README.md` and `backend/package.json` to confirm scripts and engines.
 2. Inspect `.cursor/rules/*.mdc` for project-specific coding rules and style guides; follow them when making automated edits.
 3. When editing API-related code, update both Strapi content-type/controller and the frontend service that consumes it (`frontend/lib/services/...`).
 4. Always prefer `yarn` in this repo when running scripts to match `packageManager` metadata.

- **Examples (where to look for patterns)**
  - Strapi server config: `backend/config/server.ts` (env-driven host/port/keys).
  - Backend lifecycle hooks: `backend/src/index.ts` (register/bootstrap hooks).
  - Frontend API client: `frontend/lib/api-client.ts` (how frontend calls backend services).
  - UI/component patterns: `frontend/app/_components/` and `frontend/app/_components/forms/`.

If anything here is unclear or you want more coverage (tests, CI, or release process), tell me which area to expand and I will iterate.
