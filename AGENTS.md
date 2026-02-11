# AGENTS.md

Instructions for AI coding agents working on this Next.js App Router project.

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Next.js tasks.** Next.js 16 introduces APIs not in model training data.

## Setup

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (defaults to http://localhost:3000)
```

## Build & Lint

```bash
npm run build        # Production build
npm run lint         # ESLint check
```

Always run `npm run build` and `npm run lint` before committing. Fix any errors before finishing.

## Tech Stack

- Next.js 16 App Router with React 19 Server Components
- TypeScript strict mode
- Tailwind CSS 4.x
- shadcn/ui components (`components/ui/`)
- Base UI (`@base-ui/react`) for custom interactive components
- Prisma with PostgreSQL
- Zod for validation
- Sonner for toasts
- next-themes for dark/light mode

## Next.js 16 APIs (Not in Training Data)

These APIs are new in Next.js 16 and may not be in model training data:

- `forbidden()` / `unauthorized()` - Throw from Server Components/Actions to trigger `forbidden.tsx` or `unauthorized.tsx`
- `cookies()` / `headers()` - Now async, must be awaited
- `connection()` - For dynamic rendering opt-in
- `'use cache'` directive - For caching with `cacheLife()` and `cacheTag()`
- `revalidateTag()` - Invalidate cache tags
- `after()` - Run code after response is sent

## Code Style

- **Components**: PascalCase files (`MyComponent.tsx`)
- **Folders**: kebab-case (`my-folder/`)
- **Utils/hooks**: camelCase (`useMyHook.ts`, `myUtil.ts`)
- Suffix functions that run in transitions with "Action" (e.g., `submitAction`, `deleteAction`)
- Use `type` over `interface` unless declaration merging is needed
- Use `cn` util for conditional Tailwind classes
- Use Base UI for custom interactive components not in shadcn/ui
- Add shadcn/ui components with `npx shadcn@latest add <component-name>`

## Folder Structure

```text
app/                      # File-based routing (Next.js App Router)
  [slug]/                 # Dynamic route
  dashboard/              # Dashboard routes
    _components/          # Route-local components
    [slug]/               # Nested dynamic route
      _components/        # Nested route-local components
components/               # Shared components
  ui/                     # shadcn/ui primitives
  design/                 # Design system components
data/
  queries/                # Server-side queries with cache()
  actions/                # Server Functions (mutations)
lib/                      # Utility functions
prisma/                   # Prisma schema and seeds
public/                   # Static assets
```

- **components/ui** — shadcn/ui primitives
- **components/design** — Design system components with Action props
- **data/queries** — Server-side data fetching with `cache()` for deduplication
- **data/actions** — Server Functions with `"use server"` for mutations

Route-specific code goes in `_components` folders. Shared code lives at the nearest common ancestor.

## Development Flow

Push dynamic data access (`searchParams`, `cookies()`, `headers()`, uncached fetches) as deep as possible in the component tree to maximize static content. Async components accessing dynamic data should be wrapped in `<Suspense>` with skeleton fallbacks.

- **Fetching data** — Create queries in `data/queries/`, call in Server Components. Use `cache()` for deduplication.
- **Mutating data** — Create Server Functions in `data/actions/` with `"use server"`. Invalidate with `revalidateTag()`. Use `useOptimistic` for instant feedback.
- **Caching** — Add `"use cache"` directive to pages, components, or functions you want to cache.

## Server Components (Default)

- All components are Server Components unless `'use client'` is added
- Can be `async` and fetch data with `await`
- Wrap in `<Suspense>` with fallbacks when needed
- Pass promises (not awaited data) to client components for streaming
- Use `React.cache()` for data fetching functions

## Client Components

Add `'use client'` only when needed for:

- Event handlers, hooks, browser APIs
- `use()` to unwrap promises
- `useOptimistic()` for optimistic updates
- `useFormStatus()` for form pending state
- `useTransition()` for non-blocking updates
- `router.push()` for client-side navigation

## Data Fetching & Mutations

```typescript
// Queries - use cache() for deduplication
export const getPost = cache(async (slug: string) => {
  return prisma.post.findUnique({ where: { slug } });
});

// Actions - use "use server" directive
export async function createPost(data: PostData) {
  "use server";
  // ... create post
  revalidateTag("posts");
}
```

Use `startTransition` or `useTransition` for pending state and automatic error handling.

## Prisma

```bash
npm run prisma.push      # Push schema changes to DB
npm run prisma.seed      # Seed the database
npm run prisma.studio    # Open Prisma Studio
npm run prisma.migrate   # Run migrations
npm run prisma.generate  # Generate Prisma client
```

## Error Handling

- Use `error.tsx` for error boundaries
- Use `not-found.tsx` with `notFound()` for 404 pages
- Use `unauthorized.tsx` with `unauthorized()` for auth errors
- Use `toast.success()`, `toast.error()` from Sonner for user feedback

## Important Files

- `db.ts` - Prisma client instance
- `prisma/schema.prisma` - Database schema
- `lib/utils.ts` - Utility functions including `cn()`
- `components.json` - shadcn/ui configuration
