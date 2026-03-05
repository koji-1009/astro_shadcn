# AGENTS.md

Conventions for AI agents working on this codebase.

## Tech Stack

- **Framework**: Astro 5 (SSR, Node adapter)
- **UI**: React 19 (Islands Architecture — `client:load` / `client:idle`)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **Linter/Formatter**: Biome (tab indent, double quotes)
- **Validation**: Zod (server-side only — not in client bundles)
- **Language**: TypeScript (strict)

## Project Structure

```
src/
├── components/ui/       # shadcn/ui components (auto-generated, do not edit)
├── features/            # Feature modules
│   ├── menu/
│   ├── order/
│   ├── notice/
│   ├── user/
│   └── dashboard/       # Aggregation view only (components only, no index.ts)
├── pages/
│   ├── admin/
│   ├── menu/
│   ├── api/
│   └── ...
├── shared/
│   ├── components/      # Shared Astro components
│   ├── layout/          # Layouts
│   ├── lib/             # Utilities (cn(), json())
│   └── types/           # Shared type definitions
└── styles/              # Global CSS
```

## Feature Module Convention

Each feature follows this structure:

```
features/<name>/
├── types.ts             # Type definitions and constants
├── index.ts             # Barrel export (external code imports from here)
├── data/<name>.ts       # Data layer (in-memory, exports getter/mutator functions)
└── components/          # Astro / React components
```

### Import Rules

- **From pages or other features**: use barrel export (`@/features/<name>`)
- **Within the same feature**: relative paths are acceptable, barrel preferred
- **shadcn/ui**: `@/components/ui/<name>`
- **Shared types**: `@/shared/types` or `@/shared/types/<name>`
- **Path alias**: `@/` = `src/`

### Data Layer Pattern

Data is managed with in-memory mutable state (for demo purposes):

```ts
// data/items.ts
let items: Item[] = [/* seed data */];

export function getItems(): Item[] { return items; }
export function addItem(input: ...): Item { ... }
export function updateItem(id: string, input: ...): Item | null { ... }
export function deleteItem(id: string): boolean { ... }
```

- Do not export mutable arrays directly — always use getter functions
- API routes (`src/pages/api/`) provide HTTP access to these operations

## Component Guidelines

### Purity Layers

This project separates components by their purity level (analogous to Flutter's StatelessWidget / StatefulWidget distinction):

```
.astro components      — Pure. Output is determined entirely by server data.
                         No client JS. Equivalent to StatelessWidget.

.tsx Islands            — Stateful. Holds client state (useState, event handlers).
  (client:load/idle)     Bugs and complexity are confined here.
                         Equivalent to StatefulWidget.

  └── JSX + UI inside  — Pure again. Output determined by props.
                         Equivalent to StatelessWidget children.
```

The file extension tells you the purity level at a glance. When debugging:
- Display issue → look at `.astro` files (deterministic HTML)
- Logic/state issue → look at `.tsx` Islands (bounded scope)

### Astro vs React

- **Astro (.astro)**: static display, lists, tables, layouts — zero JS, deterministic output
- **React (.tsx)**: forms, dialogs, any interactive UI — use `client:load` or `client:idle`
- **Do not use `"use client"`** — this is an Astro project, not Next.js

### View Transitions

- Layout elements (TopBar, Sidebar, Nav): `transition:animate="none"`
- Main content: `transition:animate="fade"`

### HTML Semantics

- Each page must have exactly one `<h1>`
- Tables use `<th scope="col">` for column headers
- `<nav>` elements include `aria-label`

## API Routes

- `POST /api/menus` — menu CRUD (`action: "create" | "update" | "delete"`)
- `POST /api/notices` — notice CRUD
- `POST /api/switch-role` — role switching

All use POST with JSON body. The `action` field determines the operation via `z.discriminatedUnion`.

### Validation with Zod

- API request bodies are validated with Zod schemas (`z.discriminatedUnion` on `action`)
- Dynamic route params use `schema.safeParse()` instead of `as` casts
- Zod is used **only on the server** (API routes, Astro pages) — never import Zod in `.tsx` files to avoid bundling it into client JS
- For client-side type narrowing, use `const ... as const` arrays with `.includes()` guards

## Commands

```bash
npm run dev                    # Dev server (localhost:4321)
npm run build                  # Build
npx biome check --write .     # Lint + format
```

## Coding Style

- Follow Biome config: tab indent, double quotes
- Named imports only — no `import * as React` or `React.ComponentProps`
- Japanese labels/messages are hardcoded (this is a demo app)
- Type definitions go in each feature's `types.ts`
- Avoid unnecessary `as` casts — define types correctly instead
