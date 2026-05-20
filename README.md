# Next.js 16 Async React Blog

A demo blog exploring Async React patterns with Next.js 16's Cache Components. Each post covers a real pattern used in the app, from caching and streaming to optimistic updates and transitions, focusing on crafting great UX in the in-between states.

Built with Next.js 16, React 19, Prisma, TailwindCSS v4, and shadcn/ui (Base UI).

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prisma Setup

This project uses [Prisma Postgres](https://www.prisma.io/postgres). Set your connection string in `.env`:

```env
DATABASE_URL="postgres://..."
```

```bash
pnpm prisma.generate   # Generate the Prisma client
pnpm prisma.push       # Push schema to database
pnpm prisma.seed       # Seed blog posts
pnpm prisma.studio     # View data in Prisma Studio
```

**Using SQLite instead:** Change the provider in `prisma/schema.prisma` to `sqlite`, update `db.ts` to use `@prisma/adapter-libsql`, and set `DATABASE_URL="file:./dev.db"` in `.env`.

## Project Structure

```plaintext
app/
  [slug]/                 # Public blog posts
  dashboard/              # Admin dashboard
    _components/          # Route-local components
    [slug]/               # Post detail/edit
    new/                  # Create post
components/
  design/                 # Action prop components
  ui/                     # shadcn/ui primitives
data/
  actions/                # Server Actions
  queries/                # Data fetching with cache()
```

- **components/ui** — [shadcn/ui](https://ui.shadcn.com/) components. Add with `pnpm dlx shadcn@latest add <component-name>`
- **components/design** — Components that expose [Action props](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) and handle async coordination internally

Every page folder should contain everything it needs. Components and functions live at the nearest shared space in the hierarchy.

**Naming:** PascalCase for components, kebab-case for files/folders, camelCase for functions/hooks. Suffix transition-based functions with "Action".

## Key Patterns

**Cache Components:** Uses [`cacheComponents: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) to statically render server components that don't access dynamic data. Keep pages non-async and push dynamic data access into `<Suspense>` boundaries to maximize the static shell. Use [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) with `cacheLife()` to explicitly cache additional components or functions.

**Async React:** Replace manual `isLoading`/`isError` state with React 19's coordination primitives — `useTransition` for tracking async work, `useOptimistic` for instant feedback, `Suspense` for loading boundaries, and `use()` for reading promises during render. See `AGENTS.md` for detailed patterns and examples.

## Development Flow

- **Fetching data** — Queries in `data/queries/`, wrapped with `cache()`. Await in Server Components directly, or pass the promise to a client component and unwrap with `use()`.
- **Mutating data** — Server Actions in `data/actions/` with `"use server"`. Invalidate with `revalidateTag()` + `refresh()`. Use `useTransition` + `useOptimistic` for pending state and instant feedback.
- **Navigation** — Wrap route changes in `useTransition` to get `isPending` for loading UI.
- **Caching** — Add `"use cache"` with `cacheLife()` to pages, components, or functions to include them in the static shell.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s. Errors thrown inside transitions automatically reach the nearest error boundary.

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`. Open the `.code-workspace` file to ensure correct extensions are set.

## Deployment

```bash
pnpm build
```

Deploy to [Vercel](https://vercel.com) for the easiest experience with Prisma Postgres.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
