/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.post.deleteMany();

  // Seed posts
  await prisma.post.createMany({
    data: [
      {
        content: `# React Server Components

Server Components render on the server, can be \`async\`, and fetch data directly.

## Example: BlogList

From \`app/page.tsx\`:

\`\`\`tsx
async function BlogList() {
  const posts = await getPublishedPosts();
  return posts.map(post => <Card key={post.slug}>{post.title}</Card>);
}
\`\`\`

## When to Use Client Components

Add \`'use client'\` when you need interactivity—event handlers or React hooks.

From \`app/dashboard/_components/ArchiveButton.tsx\`:

\`\`\`tsx
'use client';

export function ArchiveButton({ slug, archived }) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived);
  const isPending = optimisticArchived !== archived;

  return (
    <form
      data-pending={isPending || undefined}
      action={async () => {
        let newValue;
        setOptimisticArchived(current => {
          newValue = !current;
          return newValue;
        });
        await toggleArchivePost(slug, newValue);
      }}
    >
      <button>{optimisticArchived ? 'Unarchive' : 'Archive'}</button>
    </form>
  );
}
\`\`\`

## Example: Composition with CSS :has()

Server Components render Client Components. Use CSS \`:has()\` to style parent elements based on child state—no state lifting required:

\`\`\`tsx
// PostList.tsx (Server Component)
export async function PostList({ searchParams }) {
  const posts = await getPosts(validFilter);

  return posts.map(post => (
    <Card className="has-data-pending:animate-pulse has-data-pending:bg-muted/70">
      <ArchiveButton slug={post.slug} archived={post.archived} />
    </Card>
  ));
}
\`\`\`

The \`has-data-pending:\` variant (Tailwind's \`:has([data-pending])\`) lets the Card react to the button's pending state without becoming a Client Component.

Keep Client Components at the leaves to maximize server rendering.`,
        description: 'Server vs Client Components, CSS :has() for parent styling, data-pending attribute pattern.',
        published: true,
        slug: 'react-server-components',
        title: 'When to Use Client Components',
      },
      {
        content: `# Suspense and Streaming

Suspense specifies loading UI while async content loads, enabling streaming in Next.js.

## Example: Dashboard

From \`app/dashboard/page.tsx\`:

\`\`\`tsx
export default function DashboardPage({ searchParams }) {
  return (
    <div>
      <Suspense fallback={<PostTabsSkeleton />}>
        <PostTabs />
      </Suspense>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
\`\`\`

Separate boundaries let each section stream independently.

## Co-locating Skeletons

From \`app/dashboard/_components/PostList.tsx\`:

\`\`\`tsx
export async function PostList({ searchParams }) {
  const posts = await getPosts(filter);
  return posts.map(post => <Card key={post.slug}>...</Card>);
}

export function PostListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </Card>
      ))}
    </div>
  );
}
\`\`\`

Export skeletons alongside their components to keep them in sync.`,
        description: 'Streaming with Suspense boundaries, co-locating skeleton components with their data.',
        published: true,
        slug: 'suspense-and-streaming',
        title: 'Streaming with Suspense',
      },
      {
        content: `# Server Functions

Server Functions are async functions that run on the server for form submissions and mutations.

## Example: createPost

From \`data/actions/post-actions.ts\`:

\`\`\`tsx
'use server';

export async function createPost(formData: FormData): Promise<ActionResult> {
  const rawData = { title: formData.get('title'), ... };

  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, formData: rawData, success: false };
  }

  await prisma.post.create({ data: result.data });
  updateTag('posts');
  return { success: true };
}
\`\`\`

## Returning Errors

\`\`\`tsx
export type ActionResult =
  | { success: true }
  | { success: false; error: string; formData?: FormValues };
\`\`\`

Return submitted data on errors so forms can repopulate.

## Cache Invalidation

\`\`\`tsx
export async function updatePost(slug: string, formData: FormData) {
  // ... validate and update
  updateTag('posts');        // Invalidate the list
  updateTag(\`post-\${slug}\`); // Invalidate this post
}
\`\`\``,
        description: 'Server Functions with "use server", Zod validation, returning errors, cache invalidation.',
        published: true,
        slug: 'server-functions',
        title: 'Server Functions with Zod',
      },
      {
        content: `# useActionState

\`useActionState\` manages form state across submissions, preserving input after validation errors.

## Example: PostForm

From \`app/dashboard/_components/PostForm.tsx\`:

\`\`\`tsx
'use client';

import { useActionState } from 'react';

export function PostForm({ action, defaultValues, redirectTo }) {
  const router = useRouter();

  const [state, formAction] = useActionState(async (_prev, formData) => {
    const result = await action(formData);
    if (result.success) {
      router.push(redirectTo);
      return _prev;
    }
    return result.formData ?? _prev;
  }, defaultValues);

  return (
    <form action={formAction}>
      <input name="title" defaultValue={state.title} />
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}
\`\`\`

On error, the form data is returned so fields keep their values.

## Reusing for Create and Edit

\`\`\`tsx
// Create
<PostForm action={createPost} defaultValues={{ title: '' }} />

// Edit - use .bind() to apply the slug
<PostForm action={updatePost.bind(null, post.slug)} defaultValues={post} />
\`\`\``,
        description: 'Preserve form input on validation errors, reuse forms for create and edit with .bind().',
        published: true,
        slug: 'useactionstate',
        title: 'useActionState for Form Errors',
      },
      {
        content: `# useFormStatus

\`useFormStatus\` provides the pending state of the nearest parent form. It's the simplest way to show loading indicators during form submissions.

## Example: SubmitButton

From \`components/design/SubmitButton.tsx\`:

\`\`\`tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? <Spinner /> : children}
    </button>
  );
}
\`\`\`

## The Child Component Constraint

The hook only works in components that are children of the form:

\`\`\`tsx
// ❌ Always returns pending: false
function Form() {
  const { pending } = useFormStatus();
  return <form>...</form>;
}

// ✅ Works - SubmitButton is a child of the form
<form action={formAction}>
  <SubmitButton>Save</SubmitButton>
</form>
\`\`\`

React needs to track which form triggered the submission. By requiring the hook inside a form's children, React reliably determines the pending state for that specific form.`,
        description: 'SubmitButton component pattern, why it must be a child of the form.',
        published: true,
        slug: 'useformstatus',
        title: 'useFormStatus in SubmitButton',
      },
      {
        content: `# useOptimistic

\`useOptimistic\` provides immediate UI feedback while an action runs in the background.

## Example: ArchiveButton with Pending State

From \`app/dashboard/_components/ArchiveButton.tsx\`:

\`\`\`tsx
'use client';

import { useOptimistic } from 'react';

export function ArchiveButton({ slug, archived }) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived ?? false);
  const isPending = optimisticArchived !== (archived ?? false);

  return (
    <form
      data-pending={isPending || undefined}
      action={async () => {
        const newValue = !optimisticArchived;
        setOptimisticArchived(newValue);
        await toggleArchivePost(slug, newValue);
      }}
    >
      <button type="submit">
        {optimisticArchived ? 'Unarchive' : 'Archive'}
      </button>
    </form>
  );
}
\`\`\`

## Deriving Pending State

Compare the optimistic value to the real prop:

\`\`\`tsx
const isPending = optimisticArchived !== (archived ?? false);
\`\`\`

While the action runs, these values differ. When complete, they sync up and \`isPending\` becomes false.

## Styling Parent Elements with CSS :has()

Expose pending state via \`data-pending\` attribute. Parent Server Components can style based on this using Tailwind's \`has-data-pending:\` variant:

\`\`\`tsx
// PostList.tsx (Server Component - no 'use client' needed!)
<Card className="has-data-pending:animate-pulse has-data-pending:bg-muted/70">
  <ArchiveButton slug={post.slug} archived={post.archived} />
</Card>
\`\`\`

## How It Works

1. User submits the form
2. \`setOptimisticArchived\` immediately updates the UI and sets \`data-pending\`
3. CSS \`:has([data-pending])\` triggers parent styles (pulse animation)
4. The Server Function runs in the background
5. When complete, the real \`archived\` prop replaces the optimistic value
6. \`data-pending\` is removed, styles revert

## Important: Requires Action Context

The optimistic setter must be called inside an Action—a function passed to an action prop or wrapped in \`startTransition\`. Form \`action\` props are automatically called inside \`startTransition\`.

Use for actions with high success rates: toggles, likes, bookmarks.`,
        description: 'Deriving pending state from optimistic vs real value, data-pending for parent styling.',
        published: true,
        slug: 'useoptimistic',
        title: 'useOptimistic for Instant Feedback',
      },
      {
        content: `# The "use cache" Directive

Next.js 16 introduces \`"use cache"\` for fine-grained caching. With \`cacheComponents: true\`, data fetching is dynamic by default—you opt into caching explicitly.

## Basic Usage

From \`data/queries/post-queries.ts\`:

\`\`\`tsx
import { cache } from 'react';
import { cacheTag } from 'next/cache';

export const getPublishedPosts = cache(async () => {
  'use cache';
  cacheTag('posts');

  return await prisma.post.findMany({
    where: { published: true },
  });
});
\`\`\`

## Cache Invalidation with revalidateTag + refresh

In Server Actions, use \`revalidateTag\` with a profile plus \`refresh()\` for immediate UI updates:

\`\`\`tsx
import { refresh, revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  await prisma.post.create({ data });
  
  revalidateTag('posts', 'max'); // Stale-while-revalidate for other users
  refresh(); // Immediate refresh for the current user
}
\`\`\`

## Why Both?

| Function | Purpose |
|----------|---------|
| \`revalidateTag(tag, 'max')\` | Marks cache as stale, background revalidation |
| \`refresh()\` | Forces client router re-render immediately |

The combination ensures the current user sees updates instantly while other users get stale-while-revalidate behavior.

## Granular Tags

Tag individual items separately:

\`\`\`tsx
export const getPublishedPostBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(\`post-\${slug}\`);

  return await prisma.post.findUnique({ where: { slug } });
});
\`\`\`

When updating a post, invalidate both its specific tag and the list tag.`,
        description: 'Opt-in caching with "use cache", revalidateTag + refresh() for invalidation.',
        published: true,
        slug: 'use-cache-directive',
        title: 'Caching with use cache',
      },
      {
        content: `# View Transitions

React's \`<ViewTransition>\` component wraps the browser's View Transitions API for smooth animations between route changes.

## Page-Level Transitions

From \`app/[slug]/page.tsx\`:

\`\`\`tsx
import { ViewTransition } from 'react';

export default async function BlogPostPage({ params }) {
  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <article>...</article>
    </ViewTransition>
  );
}
\`\`\`

## Shared Element Transitions

From \`app/dashboard/_components/PostList.tsx\`—connect elements across pages with the same \`name\`:

\`\`\`tsx
<Link href={\`/dashboard/\${post.slug}\`}>
  <ViewTransition name={\`post-card-\${post.slug}\`} share="morph">
    <Card>{post.title}</Card>
  </ViewTransition>
</Link>
\`\`\`

The card morphs into the detail page when navigating.

## Browser Support

Uses the browser's native View Transitions API. In unsupported browsers, navigation works normally—progressive enhancement.`,
        description: 'Page-level enter/exit animations, shared element transitions with name + share="morph".',
        published: true,
        slug: 'view-transitions',
        title: 'View Transitions API',
      },
      {
        content: `# Error Handling

Next.js provides file conventions for handling errors automatically.

## error.tsx

From \`app/dashboard/[slug]/error.tsx\`:

\`\`\`tsx
'use client';

export default function PostError({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

Error boundaries must be Client Components. The \`reset\` function re-renders the boundary's contents.

## not-found.tsx

From \`app/dashboard/[slug]/not-found.tsx\`:

\`\`\`tsx
export default function PostNotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <Link href="/dashboard">Back to posts</Link>
    </div>
  );
}
\`\`\`

Trigger it with \`notFound()\` in queries:

\`\`\`tsx
const post = await prisma.post.findUnique({ where: { slug } });
if (!post) notFound();
\`\`\`

Errors bubble up to the nearest boundary. Create \`error.tsx\` at different route levels for granular handling.`,
        description: 'error.tsx with reset(), not-found.tsx with notFound(), error boundary placement.',
        published: true,
        slug: 'error-handling',
        title: 'Error Handling Patterns',
      },
      {
        content: `# generateStaticParams

\`generateStaticParams\` pre-renders dynamic routes at build time—instant page loads, no loading states.

## Basic Usage

From \`app/[slug]/page.tsx\`:

\`\`\`tsx
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  return <MarkdownContent>{post.content}</MarkdownContent>;
}
\`\`\`

## Dynamic Metadata

Combine with \`generateMetadata\` for SEO:

\`\`\`tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  return { title: post.title, description: post.description };
}
\`\`\`

New slugs not in \`generateStaticParams\` are generated on-demand and cached. Use \`updateTag()\` to invalidate when content changes.`,
        description: 'Pre-render dynamic routes, generateMetadata for SEO, on-demand generation for new slugs.',
        published: true,
        slug: 'generatestaticparams',
        title: 'generateStaticParams',
      },
      {
        content: `# URL State with searchParams

URL search parameters provide shareable, bookmarkable state that persists across refreshes.

## Reading searchParams

From \`app/dashboard/_components/PostList.tsx\`:

\`\`\`tsx
const filterSchema = z.enum(['all', 'published', 'drafts', 'archived']).catch('all');
const sortSchema = z.enum(['newest', 'oldest', 'title']).catch('newest');

export async function PostList({ searchParams }) {
  const { filter, sort } = await searchParams;
  const validFilter = filterSchema.parse(filter);
  const validSort = sortSchema.parse(sort);
  const posts = await getPosts(validFilter, validSort);
  // ...
}
\`\`\`

## Updating URL State

From \`app/dashboard/_components/PostTabs.tsx\`:

\`\`\`tsx
'use client';

export function PostTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('filter') ?? 'all';
  const currentSort = searchParams.get('sort') ?? 'newest';

  function tabAction(value: string) {
    // Preserve other params when updating one
    router.push(\`/dashboard?filter=\${value}&sort=\${currentSort}\`);
  }

  return <TabList activeTab={currentTab} changeAction={tabAction} />;
}
\`\`\`

## Cycle Button with Optimistic State

From \`app/dashboard/_components/SortButton.tsx\`—a button that cycles through options:

\`\`\`tsx
'use client';

const sortOptions = [
  { icon: ArrowUpDown, label: 'Newest', value: 'newest' },
  { icon: ArrowDownUp, label: 'Oldest', value: 'oldest' },
  { icon: ArrowDownAZ, label: 'Title', value: 'title' },
];

export function SortButton() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentSort = searchParams.get('sort') ?? 'newest';
  const currentFilter = searchParams.get('filter') ?? 'all';

  const [optimisticSort, setOptimisticSort] = useOptimistic(currentSort);
  const [isPending, startTransition] = useTransition();

  const currentIndex = sortOptions.findIndex(opt => opt.value === optimisticSort);
  const nextIndex = (currentIndex + 1) % sortOptions.length;
  const nextSort = sortOptions[nextIndex].value;

  function sortAction() {
    startTransition(() => {
      setOptimisticSort(nextSort);
      router.push(\`/dashboard?filter=\${currentFilter}&sort=\${nextSort}\`);
    });
  }

  return (
    <Button onClick={sortAction} disabled={isPending}>
      {sortOptions[currentIndex].label}
    </Button>
  );
}
\`\`\`

URL state works with browser history and makes pages shareable—\`/dashboard?filter=drafts&sort=title\` shows exactly that view.`,
        description: 'Shareable filter/sort state, preserving params on update, cycle button with optimistic UI.',
        published: true,
        slug: 'url-state-searchparams',
        title: 'URL State with searchParams',
      },
      {
        content: `# React cache()

React's \`cache()\` deduplicates requests within a single render pass.

## Example: getPostBySlug

From \`data/queries/post-queries.ts\`:

\`\`\`tsx
import { cache } from 'react';

export const getPostBySlug = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();
  return post;
});
\`\`\`

Multiple components can call \`getPostBySlug(slug)\` independently—only one query executes.

## Combining with "use cache"

\`cache()\` deduplicates within a render. \`"use cache"\` caches across requests:

\`\`\`tsx
export const getPublishedPostBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(\`post-\${slug}\`);

  return await prisma.post.findUnique({ where: { slug } });
});
\`\`\`

Both work together—\`cache()\` prevents duplicate queries during rendering, \`"use cache"\` stores results for future requests.`,
        description: 'Request deduplication with cache(), combining with "use cache" for cross-request caching.',
        published: true,
        slug: 'react-cache',
        title: 'cache() for Deduplication',
      },
      {
        content: `# useTransition

\`useTransition\` marks state updates as non-urgent, keeping your UI responsive during expensive operations.

## Example: DeletePostButton

From \`app/dashboard/[slug]/_components/DeletePostButton.tsx\`:

\`\`\`tsx
'use client';

import { useTransition } from 'react';

export function DeletePostButton({ slug }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function deleteAction() {
    startTransition(async () => {
      await deletePost(slug);
      router.push('/dashboard');
    });
  }

  return (
    <button onClick={deleteAction} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
\`\`\`

When clicked, \`isPending\` becomes true immediately and stays true until the Server Function and navigation complete.

## Caveat: State Updates After Await

State updates after \`await\` need nested \`startTransition\`:

\`\`\`tsx
startTransition(async () => {
  await someAsyncFunction();
  startTransition(() => { setState('done'); }); // ✅
});
\`\`\`

In the delete example, \`router.push\` handles this internally.`,
        description: 'isPending for delete buttons, nested startTransition for state updates after await.',
        published: true,
        slug: 'usetransition',
        title: 'useTransition for Pending UI',
      },
      {
        content: `# Skeleton Loading

Skeletons are placeholder UI that mimics content shape, reducing perceived loading time.

## Example: PostListSkeleton

From \`app/dashboard/_components/PostList.tsx\`—export skeletons alongside their components:

\`\`\`tsx
export async function PostList({ searchParams }) {
  const posts = await getPosts(filter);
  return posts.map(post => <PostCard post={post} />);
}

export function PostListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
\`\`\`

## Using with Suspense

\`\`\`tsx
<Suspense fallback={<PostListSkeleton />}>
  <PostList searchParams={searchParams} />
</Suspense>
\`\`\`

Keep skeletons next to their components—when you change the layout, the skeleton is right there to update.`,
        description: 'Export skeletons alongside components, match layout structure, use with Suspense.',
        published: true,
        slug: 'skeleton-loading',
        title: 'Skeleton Co-location Pattern',
      },
      {
        content: `# Authorization Patterns

Next.js provides \`unauthorized()\` for handling authorization in Server Components.

## Checking Authorization

\`\`\`tsx
import { unauthorized } from 'next/navigation';

export default function DashboardPage() {
  if (!canManagePosts()) {
    unauthorized();
  }
  return <Dashboard />;
}
\`\`\`

## The unauthorized.tsx File

From \`app/dashboard/unauthorized.tsx\`:

\`\`\`tsx
export default function Unauthorized() {
  return (
    <Card className="text-center">
      <CardTitle>Unauthorized</CardTitle>
      <CardDescription>You need to be logged in.</CardDescription>
      <Link href="/">Back to Blog</Link>
    </Card>
  );
}
\`\`\`

## Protecting Server Functions

Always check authorization in actions too:

\`\`\`tsx
export async function deletePost(slug: string) {
  if (!canManagePosts()) throw new Error('Unauthorized');
  await prisma.post.delete({ where: { slug } });
}
\`\`\``,
        description: 'unauthorized() in Server Components, unauthorized.tsx files, protecting Server Functions.',
        published: true,
        slug: 'authorization',
        title: 'Authorization with unauthorized()',
      },
      {
        content: `# Static vs Dynamic Rendering

With \`cacheComponents: true\`, Next.js defaults to dynamic. You opt into static with \`"use cache"\`.

## Static: The Blog Homepage

\`\`\`tsx
async function BlogList() {
  const posts = await getPublishedPosts(); // Uses "use cache"
  return posts.map(post => <PostCard post={post} />);
}
\`\`\`

Because \`getPublishedPosts\` uses \`"use cache"\`, results are cached. No loading states needed—content is ready.

## Dynamic: The Dashboard

\`\`\`tsx
export default function DashboardPage({ searchParams }) {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostList searchParams={searchParams} />
    </Suspense>
  );
}
\`\`\`

The \`searchParams\` prop triggers dynamic rendering. Each request fetches fresh data, so Suspense fallbacks show while loading.

## What Makes a Page Dynamic?

- Reading \`searchParams\` or \`params\`
- Calling \`cookies()\` or \`headers()\`
- Data fetches without \`"use cache"\`

## Invalidating Static Content

\`\`\`tsx
export async function createPost(formData: FormData) {
  await prisma.post.create({ data });
  updateTag('posts');
}
\`\`\`

After \`updateTag\`, the next request regenerates the content.`,
        description: 'What triggers dynamic rendering, when Suspense shows fallbacks, updateTag() for ISR.',
        published: true,
        slug: 'static-vs-dynamic',
        title: 'Static vs Dynamic Rendering',
      },
      {
        content: `# The Action Prop Pattern

Design components can accept \`action\` props and handle async coordination internally—keeping parent components simple.

## Example: TabList

From \`components/design/TabList.tsx\`:

\`\`\`tsx
'use client';

import { useOptimistic, useTransition } from 'react';

type TabListProps = {
  tabs: Tab[];
  activeTab: string;
  changeAction?: (value: string) => void | Promise<void>;
};

export function TabList({ tabs, activeTab, changeAction }: TabListProps) {
  const [optimisticTab, setOptimisticTab] = useOptimistic(activeTab);
  const [isPending, startTransition] = useTransition();

  function tabChangeAction(value: string) {
    startTransition(async () => {
      setOptimisticTab(value);
      await changeAction?.(value);
    });
  }

  return (
    <Tabs value={optimisticTab}>
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} onClick={() => tabChangeAction(tab.value)}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {isPending && <Loader2 className="animate-spin" />}
    </Tabs>
  );
}
\`\`\`

## Why This Works

The component handles:
- **Optimistic updates** — Tab switches instantly via \`useOptimistic\`
- **Pending state** — Shows a spinner while the action runs
- **Transition wrapping** — Keeps UI responsive, avoids Suspense fallbacks

The parent just passes the action:

\`\`\`tsx
export function PostTabs() {
  const router = useRouter();

  function tabAction(value: string) {
    router.push(\`/dashboard?filter=\${value}\`);
  }

  return <TabList tabs={tabs} activeTab={currentTab} changeAction={tabAction} />;
}
\`\`\`

## Naming Convention

Use descriptive suffixes: \`changeAction\`, \`submitAction\`, \`deleteAction\`. This signals that the prop triggers an async operation with built-in UX handling.`,
        description: 'Parent passes async function, child owns useTransition, design/SubmitButton pattern.',
        published: true,
        slug: 'action-prop-pattern',
        title: 'The Action Prop Pattern',
      },
      {
        content: `# useLinkStatus for Link Pending State

The \`useLinkStatus\` hook provides pending state for \`<Link>\` navigations. It must be used inside a descendant component of \`Link\`.

## When It Shows Pending

The spinner appears automatically when navigation takes time:
- **Slow connections** — Prefetching hasn't completed before the click
- **Dynamic routes** — Routes that can't be fully prefetched (e.g., routes reading \`searchParams\`)
- **Large payloads** — Even prefetched routes can take time to render

On fast connections with prefetched routes, the spinner won't appear—and that's the ideal case. Don't disable prefetching just to see the spinner.

## The Pattern

\`\`\`tsx
'use client';

import Link, { useLinkStatus } from 'next/link';
import { Loader2, ArrowUpDown } from 'lucide-react';

function SortIndicator({ icon: Icon, label }: { icon: typeof ArrowUpDown; label: string }) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
      <span>{label}</span>
    </>
  );
}

export function SortButton() {
  return (
    <Link href="/dashboard?sort=newest" className="...">
      <SortIndicator icon={ArrowUpDown} label="Newest" />
    </Link>
  );
}
\`\`\`

## Key Points

1. **Must be a Link descendant** - \`useLinkStatus\` only works inside a component rendered within \`<Link>\`
2. **Keep prefetching enabled** - The spinner is a fallback for when prefetching hasn't completed, not a feature to engineer
3. **Extract to child component** - The hook tracks the parent Link's navigation state
4. **Style as Link** - Use \`buttonVariants\` from shadcn/ui to style Links as buttons

## vs useTransition + router.push

| Approach | Pros | Cons |
|----------|------|------|
| \`useLinkStatus\` | Simpler, no state management, declarative | Must use \`<Link>\`, no optimistic updates |
| \`useTransition\` + \`router.push\` | Full control, optimistic updates possible | More boilerplate, imperative |

Choose \`useLinkStatus\` for simple navigation feedback. Use \`useTransition\` when you need optimistic state updates during navigation.`,
        description: 'Track Link pending state, SortButton pattern, spinner as fallback not feature.',
        published: true,
        slug: 'uselinkstatus',
        title: 'useLinkStatus for Navigation',
      },
    ],
  });

  console.log('✅ Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
