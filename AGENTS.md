# AGENTS.md

Instructions for AI coding agents working on this Next.js 16 App Router project.

**IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any Next.js tasks.** Next.js 16 introduces APIs not in model training data.

## Commands

```bash
bun install
bun run dev          # http://localhost:3000
bun run build        # run before committing
bun run lint         # run before committing
```

## Stack

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS 4 · shadcn/ui · Base UI · Prisma (PostgreSQL) · Zod · Sonner · next-themes

## Next.js 16 APIs (not in training data)

- `cookies()` / `headers()` — now async, must be awaited
- `forbidden()` / `unauthorized()` — throw from Server Components to trigger `forbidden.tsx` / `unauthorized.tsx`
- `connection()` — opt into dynamic rendering
- `'use cache'` + `cacheLife()` + `cacheTag()` — caching directive
- `revalidateTag()` — invalidate cache tags
- `refresh()` — refresh client router from Server Actions
- `after()` — run code after response is sent

## Typed Routes

`typedRoutes: true` generates `.next/types/routes.d.ts`. Use framework types instead of custom ones:

- Pages: `PageProps<'/'>` — `params` and `searchParams` are promises
- Layouts: `LayoutProps<'/'>` — `params` and `children`
- Route handlers: `RouteContext<'/api/...'>`

## Folder Structure

```
app/                    # File-based routing
  [slug]/               # Public blog posts
  dashboard/            # Admin dashboard
    _components/        # Route-local components
    [slug]/             # Post detail/edit
      _components/      # Nested route-local components
    new/                # Create post
components/
  ui/                   # shadcn/ui primitives (add: bunx shadcn@latest add <n>)
  design/               # Design system — Action props pattern (see below)
data/
  queries/              # Server-side data fetching, wrapped with cache()
  actions/              # Server Functions ("use server")
lib/
prisma/                 # Prisma schema and seeds
```

## Code Style

- Components: `PascalCase.tsx` · Folders: `kebab-case/` · Utils/hooks: `camelCase.ts`
- Suffix functions that run in transitions with "Action" (`submitAction`, `deleteAction`, `changeAction`)
- `type` over `interface` unless declaration merging needed
- `cn()` from `lib/utils.ts` for conditional Tailwind classes
- Use Base UI for interactive components not covered by shadcn/ui

## cacheComponents & Static Shell

`cacheComponents: true` in `next.config.ts` caches server components that don't access dynamic data. To maximize the static shell:

- Keep pages **non-async**. Push `searchParams`, `cookies()`, `headers()` into async server components inside `<Suspense>`.
- Start fetches without awaiting, pass the promise to client components, unwrap with `use()`.

## Data Fetching & Mutations

**Queries** live in `data/queries/`. Wrap with `React.cache()` for deduplication. Await directly in Server Components. Only pass the promise unawaited if a client component needs to unwrap it with `use()`.

```ts
// data/queries/posts.ts
import { cache } from 'react';
export const getPost = cache(async (slug: string) => {
  return prisma.post.findUnique({ where: { slug } });
});
```

```tsx
// Server Component — just await
const data = await getPost(slug);

// If a client component needs it, pass the promise instead
const dataPromise = getPost(slug);
return <PostView dataPromise={dataPromise} />;
// then in the client component: const data = use(dataPromise);
```

**Mutations** live in `data/actions/` with `"use server"`. Invalidate with `revalidateTag()` + `refresh()` after mutating. Always call from within a transition for pending state.

```ts
// data/actions/posts.ts
'use server';
export async function deletePostAction(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidateTag('posts', 'max');
  refresh();
}
```

```tsx
startTransition(async () => {
  await deletePostAction(id);
});
```

## Async React Patterns

Replace manual `isLoading`/`isError` state with React 19 primitives:

**Actions** — any async function run inside `startTransition`. React tracks `isPending` automatically; unexpected errors bubble to error boundaries. Suffix with "Action" to signal transition context.

```tsx
const [isPending, startTransition] = useTransition();
function submitAction(value: string) {
  startTransition(() => { setValue(value); });
}
```

**Optimistic updates** — `useOptimistic` updates immediately inside a transition, reverts automatically on failure.

```tsx
const [optimisticValue, setOptimisticValue] = useOptimistic(value);
startTransition(async () => {
  setOptimisticValue(next);
  await saveAction(next);
});
```

**Suspense** — declare loading boundaries. Shows the fallback on first load; subsequent updates keep old content visible automatically. Wrap with a co-located skeleton whenever accessing dynamic data.

**`use()`** — unwrap promises in client components during render. Suspends until resolved; errors go to the nearest error boundary. The promise must come from a Server Component or `cache()`-wrapped query so it's stable across renders.

**`useFormStatus`** — read pending state from a parent `<form>` action. Use for submit buttons and form-level loading indicators.

## Design Components (Action Props Pattern)

Components in `components/design/` handle coordination internally and expose Action props to consumers.

```tsx
// Consumer
<Design.SubmitButton submitAction={createPostAction} />

// Inside a design component
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();
  function handleClick() {
    startTransition(async () => {
      await submitAction();
    });
  }
  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? <Spinner /> : 'Submit'}
    </Button>
  );
}
```

## Pending UI

Set `data-pending={isPending ? '' : undefined}` on a root element. Style ancestors with `has-data-pending:animate-pulse` or `group-has-data-pending:animate-pulse`.

## Skeleton Co-location

Export skeleton components from the **same file** as their component, placed below the main export.

## Prisma

```bash
bun run prisma.push      # Push schema changes to DB
bun run prisma.seed      # Seed the database
bun run prisma.studio    # Open Prisma Studio
bun run prisma.migrate   # Run migrations
bun run prisma.generate  # Generate Prisma client
```

## Error Handling

- `error.tsx` — error boundaries
- `not-found.tsx` + `notFound()` — 404s
- `unauthorized.tsx` + `unauthorized()` — auth errors
- `toast.success()` / `toast.error()` from Sonner for user feedback
- Errors inside transitions bubble to error boundaries automatically — no try/catch needed

## Important Files

- `db.ts` — Prisma client instance
- `prisma/schema.prisma` — Database schema
- `lib/utils.ts` — Utility functions including `cn()`
- `next.config.ts` — `typedRoutes`, `cacheComponents`, `reactCompiler`
- `components.json` — shadcn/ui configuration
