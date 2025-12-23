# Next.js 16 Modern Blog

A self-documenting blog demo built with [Next.js 16](https://nextjs.org/), [Prisma](https://www.prisma.io/), [Tailwind CSS v4](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/) (built on [Base UI](https://base-ui.com/)). The blog posts explain the React 19 patterns used to build the app.

Features opt-in caching with [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) and Partial Pre-Rendering via [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents).

## Self-Documenting

Run `bun run prisma.seed` to populate the blog with posts explaining each pattern:

- React Server Components
- Suspense and Streaming
- Server Actions
- useActionState
- useFormStatus
- useOptimistic
- The "use cache" Directive
- View Transitions
- Error Handling
- generateStaticParams
- URL State with searchParams
- React cache()
- useTransition
- Skeleton Loading
- Authorization Patterns

Each post uses code examples from this app.

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prisma Setup

This project uses [Prisma Postgres](https://www.prisma.io/postgres). Set your connection string in `.env`:

```env
DATABASE_URL="postgres://..."
```

```bash
bun run prisma.generate   # Generate the Prisma client
bun run prisma.push       # Push schema to database
bun run prisma.seed       # Seed blog posts
bun run prisma.studio     # View data in Prisma Studio
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

- **components/ui** — [shadcn/ui](https://ui.shadcn.com/) components. Add with `bunx shadcn@latest add <component-name>`
- **components/design** — Components that expose [Action props](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) and handle async coordination internally

Every page folder should contain everything it needs. Components and functions live at the nearest shared space in the hierarchy.

**Naming:** PascalCase for components, kebab-case for files/folders, camelCase for functions/hooks.

## Development Flow

This project uses [`cacheComponents: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) — data fetching is **dynamic by default**. Push dynamic data access (`searchParams`, `cookies()`, `headers()`, uncached fetches) as deep as possible in the component tree to maximize static content. Async components accessing dynamic data must be wrapped in `<Suspense>` with skeleton fallbacks.

- **Fetching data** — Create queries in `data/queries/`, call in Server Components. Wrap with `cache()` for deduplication.
- **Mutating data** — Create Server Actions in `data/actions/` with `"use server"`. Invalidate with `updateTag()` or `revalidateTag()`. Use `useTransition` or `useFormStatus` for pending states, `useOptimistic` for instant feedback.
- **Navigation** — Wrap state changes in `useTransition` to keep old content visible while loading.
- **Caching** — Add [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) to pages, components, or functions you want to pre-render or cache.

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`. Open the `.code-workspace` file to ensure correct extensions are set.

## Deployment

```bash
bun run build
```

Deploy to [Vercel](https://vercel.com) for the easiest experience with Prisma Postgres.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
