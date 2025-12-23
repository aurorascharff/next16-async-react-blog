# Next.js 16 Modern Blog

A modern blog demo built with Next.js 16, Prisma, TailwindCSS v4, and shadcn/ui (Base UI), showcasing React 19 patterns with "use cache", view transitions, and optimistic updates.

## Getting Started

Install dependencies and run the development server:

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Prisma Setup

This project uses [Prisma Postgres](https://www.prisma.io/postgres). Set your connection string in `.env`:

```env
DATABASE_URL="postgres://..."
```

Generate the Prisma client (runs automatically on `bun install`):

```bash
bun prisma generate
```

Push the schema:

```bash
bun prisma db push
```

Seed initial data:

```bash
bun prisma db seed
```

View data in Prisma Studio:

```bash
bun prisma studio
```

To use a local SQLite database instead, change the provider in `prisma/schema.prisma` to `sqlite`, update `db.ts` to use `@prisma/adapter-libsql`, and set `DATABASE_URL="file:./dev.db"` in `.env`.

## Project Structure

- `app` - Pages and layouts using [file-based routing](https://nextjs.org/docs/app/building-your-application/routing)
- `components` - Shared components
- `components/ui` - [shadcn/ui](https://ui.shadcn.com/) components built on [Base UI](https://base-ui.com/). Add with `bunx shadcn@latest add <component-name>`
- `components/design` - Design components that expose [Action props](https://react.dev/reference/react/useTransition#exposing-action-props-from-components) and handle async coordination internally
- `data/actions` - [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) for mutations
- `data/queries` - Server-side data queries with [`cache()`](https://react.dev/reference/react/cache)
- `_components` - Route-local components (prefixed with `_`)

Every page folder should contain everything it needs to work. Every component or function should live at the nearest shared space in the hierarchy.

## Development Tools

The project uses [ESLint](https://eslint.org/) for linting and [Prettier](https://prettier.io/) for code formatting. The configuration is in `eslint.config.mjs` and `.prettierrc`. The project is configured to run code formatting and linting on save in Visual Studio Code. Opening the `.code-workspace` file will ensure the correct extensions are set.

## Naming Conventions

- Pascal case for components
- Kebab case for folders and files
- Camel case for utility functions and hooks

## Development Flow

This project uses [`cacheComponents: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) - data fetching is **dynamic by default**. To maximize static content, push dynamic data access (`searchParams`, `cookies()`, `headers()`, uncached fetches) as deep as possible in the component tree. This allows parent components to be prerendered while only the dynamic parts stream in. Async components accessing dynamic data must be wrapped in `<Suspense>` with skeleton fallbacks.

**Fetching data** → Create queries in `data/queries/` and call them directly in async Server Components. Wrap with `cache()` for deduplication.
**Mutating data** → Create Server Actions in `data/actions/` with `"use server"`. Invalidate with `updateTag()` or `revalidateTag()`. Use `useTransition` or `useFormStatus` for pending states, `useOptimistic` for instant feedback.
**Navigation and filtering** → Wrap state changes in `useTransition` to keep old content visible while new data loads.
**Opting into caching** → Add [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) to pages, components, or functions you want to pre-render or cache.

## Deployment

Build for production:

```bash
bun run build
```

Deploy to [Vercel](https://vercel.com) for the easiest experience with Prisma Postgres.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
