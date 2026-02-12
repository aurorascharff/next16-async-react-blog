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

  // Seed posts - "Async React Patterns with Next.js 16"
  await prisma.post.createMany({
    data: [
      {
        content: `# The In-Between States

Have you ever used an app and thought "this feels slow" or "this is janky" without knowing exactly why? The answer often lies in the **in-between moments**—loading screens, error states, and the gaps between user action and final render.

## The Coordination Problem

Building async UIs has always been difficult. Navigation hides content behind spinners, search boxes create race conditions, and form submissions require manual state management for every loading flag. Every async operation forces you to orchestrate the coordination manually.

This isn't a performance problem—it's a **coordination problem**. And React's primitives now solve it declaratively.

## What Happens Between?

Every async operation has three phases:

\`\`\`
User Action → Loading → Success or Error
\`\`\`

In React applications, this happens constantly:
- **Async data loading** — Fetching content from the server
- **Async mutations** — Submitting forms, toggling states
- **Async routing** — Navigating between pages

## Why These Moments Matter

The in-between states determine how polished your app feels:

| Bad UX | Good UX |
|--------|---------|
| Blank screens | Skeleton placeholders |
| Jumping layouts (CLS) | Stable, reserved space |
| Frozen buttons | Instant optimistic feedback |
| Full-page spinners | Localized loading indicators |
| Generic errors | Contextual error recovery |

## Not a DX Problem

These are **UX problems**, which is why engineers often overlook them. We focus on making things work, not on what users see while they wait.

The following posts explore each pattern with real examples from this app—showing how to coordinate loading, mutations, and navigation seamlessly.`,
        description: 'Why in-between states matter and how to solve the coordination problem.',
        published: true,
        slug: 'in-between-states',
        title: 'The In-Between States',
      },
      {
        content: `# When to Use Client Components

Server Components fetch data. Client Components handle interactions. The split determines where in-between states live.

**Server Components** determine *what* loads—async, fetch data directly, render on the server. **Client Components** handle *how users interact*—optimistic updates, pending indicators, form state.

## Server Components: Data Fetching

\`\`\`tsx
async function BlogList() {
  const posts = await getPublishedPosts();
  return posts.map(post => <Card key={post.slug}>{post.title}</Card>);
}
\`\`\`

No loading state management—Suspense handles that.

## Client Components: Interactions

Add \`'use client'\` when you need hooks or event handlers:

\`\`\`tsx
'use client';

export function ArchiveButton({ slug, archived }) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived);
  const isPending = optimisticArchived !== archived;

  return (
    <form data-pending={isPending || undefined} action={...}>
      <button>{optimisticArchived ? 'Unarchive' : 'Archive'}</button>
    </form>
  );
}
\`\`\`

## CSS :has() for Parent Styling

The \`data-pending\` attribute lets Server Components style based on child state:

\`\`\`tsx
<Card className="has-data-pending:animate-pulse has-data-pending:bg-muted/70">
  <ArchiveButton slug={post.slug} archived={post.archived} />
</Card>
\`\`\`

Tailwind's \`has-data-pending:\` maps to CSS \`:has([data-pending])\`. The Card pulses during the action—no Client Component needed.

## The Principle

Keep Client Components at the leaves. Server Components handle layout and data; Client Components handle interactive in-between states.`,
        description: 'Server vs Client Components, CSS :has() for parent styling, data-pending pattern.',
        published: true,
        slug: 'react-server-components',
        title: 'When to Use Client Components',
      },
      {
        content: `# Streaming with Suspense

Without Suspense, users see blank screens while data loads. With it, you **design** what they see—skeleton placeholders that indicate progress, not emptiness.

Each Suspense boundary is a design decision: "What should users see while this section loads?"

## Independent Streaming

\`\`\`tsx
<Suspense fallback={<PostTabsSkeleton />}>
  <PostTabs />
</Suspense>
<Suspense fallback={<PostListSkeleton />}>
  <PostList searchParams={searchParams} />
</Suspense>
\`\`\`

Separate boundaries let sections stream in parallel—tabs render before posts.

## Boundary Placement

| Scenario | Strategy |
|----------|----------|
| Related content | Single boundary, load together |
| Independent sections | Separate boundaries, stream in parallel |
| Critical UI (header, nav) | Outside boundaries, always visible |

## Co-locating Skeletons

Export skeletons alongside their components:

\`\`\`tsx
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

When the layout changes, the skeleton is right there to update.

## Transitions Keep Content Visible

Suspense fallbacks appear on initial load. During navigation, \`startTransition\` keeps existing content visible—preventing the fallback from reappearing.`,
        description: 'Suspense boundaries, co-locating skeletons, transition behavior.',
        published: true,
        slug: 'suspense-and-streaming',
        title: 'Streaming with Suspense',
      },
      {
        content: `# Server Functions

Form submissions are classic in-between state challenges. Server Functions (\`"use server"\`) handle validation, database writes, cache invalidation, and error recovery.

## The Pattern

\`\`\`tsx
'use server';

export async function createPost(formData: FormData): Promise<ActionResult> {
  const result = postSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message, formData };
  }

  await prisma.post.create({ data: result.data });
  revalidateTag('posts', 'max');
  refresh();
  return { success: true };
}
\`\`\`

## Preserving Input on Errors

Return submitted data so forms can repopulate on validation failure:

\`\`\`tsx
type ActionResult =
  | { success: true }
  | { success: false; error: string; formData?: FormValues };
\`\`\`

## Cache Invalidation

\`\`\`tsx
revalidateTag('posts', 'max'); // Background revalidation
refresh();                      // Immediate update for current user
\`\`\`

The combination ensures instant feedback for the current user.`,
        description: 'Server Functions with validation, error recovery, cache invalidation.',
        published: true,
        slug: 'server-functions',
        title: 'Server Functions',
      },
      {
        content: `# useActionState

\`useActionState\` preserves form input across submissions. When validation fails, users don't lose their work.

## The Pattern

\`\`\`tsx
'use client';

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
    <Input name="title" defaultValue={state.title} />
    <SubmitButton>Save</SubmitButton>
  </form>
);
\`\`\`

When validation fails, \`state\` updates with the returned data and inputs repopulate.

## Reusing for Create and Edit

\`\`\`tsx
// Create
<PostForm action={createPost} defaultValues={{ title: '', content: '' }} />

// Edit
<PostForm action={updatePost.bind(null, slug)} defaultValues={post} />
\`\`\`

Same component, different actions, consistent error recovery.`,
        description: 'Preserve form input on validation errors, reuse forms for create and edit.',
        published: true,
        slug: 'useactionstate',
        title: 'useActionState for Forms',
      },
      {
        content: `# useFormStatus

Feedback should be localized. \`useFormStatus\` provides the pending state of the nearest parent form.

## The SubmitButton Pattern

\`\`\`tsx
'use client';

export function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
\`\`\`

Drop it in any form—no prop drilling needed.

## The Child Constraint

The hook must be called from a **child** of the form:

\`\`\`tsx
// ✅ Works - SubmitButton is inside the form
<form action={formAction}>
  <SubmitButton>Save</SubmitButton>
</form>
\`\`\`

Button click → button feedback. \`useFormStatus\` keeps feedback where it belongs.`,
        description: 'SubmitButton pattern, localized feedback, child component constraint.',
        published: true,
        slug: 'useformstatus',
        title: 'useFormStatus',
      },
      {
        content: `# useOptimistic

The best in-between state is **no perceived delay**. Optimistic updates show the result immediately while the action runs.

## The Pattern

\`\`\`tsx
'use client';

export function ArchiveButton({ slug, archived }) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived);
  const isPending = optimisticArchived !== archived;

  return (
    <form data-pending={isPending || undefined} action={...}>
      <button>{optimisticArchived ? 'Unarchive' : 'Archive'}</button>
    </form>
  );
}
\`\`\`

## Deriving Pending State

\`\`\`tsx
const isPending = optimisticArchived !== archived;
\`\`\`

While the action runs, values differ. When complete, they sync and \`isPending\` becomes false.

## Parent Styling with CSS :has()

\`\`\`tsx
<Card className="has-data-pending:animate-pulse">
  <ArchiveButton slug={post.slug} archived={post.archived} />
</Card>
\`\`\`

Best for high success rate actions: toggles, likes, bookmarks.`,
        description: 'Deriving pending state, data-pending for parent styling.',
        published: true,
        slug: 'useoptimistic',
        title: 'useOptimistic for Instant Feedback',
      },
      {
        content: `# The "use cache" Directive

Caching eliminates in-between states—if content is pre-rendered, there's nothing to wait for. Next.js 16 uses \`"use cache"\` for fine-grained caching control.

With \`cacheComponents: true\`, data fetching is dynamic by default—you opt into caching explicitly.

## Basic Usage

\`\`\`tsx
export const getPublishedPosts = cache(async () => {
  'use cache';
  cacheTag('posts');
  return await prisma.post.findMany({ where: { published: true } });
});
\`\`\`

## Cache Invalidation

\`\`\`tsx
revalidateTag('posts', 'max'); // Background revalidation
refresh();                      // Immediate update for current user
\`\`\`

| Function | Purpose |
|----------|---------|
| \`revalidateTag(tag, 'max')\` | Marks cache stale, background revalidation |
| \`refresh()\` | Forces immediate client re-render |

## Granular Tags

\`\`\`tsx
cacheTag(\`post-\${slug}\`);  // Tag individual items
\`\`\`

Invalidate specific posts without clearing the entire list.`,
        description: '"use cache" directive, revalidateTag + refresh() for invalidation.',
        published: true,
        slug: 'use-cache-directive',
        title: 'Caching with use cache',
      },
      {
        content: `# View Transitions

Route changes are a unique in-between state. Without animation, content disappears then reappears—users lose spatial context.

React's \`<ViewTransition>\` wraps the browser's View Transitions API.

## Page-Level Transitions

\`\`\`tsx
<ViewTransition enter="slide-from-right" exit="slide-to-right">
  <article>...</article>
</ViewTransition>
\`\`\`

## Shared Element Transitions

Connect elements across pages with the same \`name\`:

\`\`\`tsx
<ViewTransition name={\`post-card-\${post.slug}\`} share="morph">
  <Card>{post.title}</Card>
</ViewTransition>
\`\`\`

The card morphs into the detail page when navigating.

## Browser Support

Uses native View Transitions API. Unsupported browsers get normal navigation—progressive enhancement.`,
        description: 'Page-level transitions, shared element morphing.',
        published: true,
        slug: 'view-transitions',
        title: 'View Transitions API',
      },
      {
        content: `# Error Handling

Errors are in-between states we hope users never see—but they will. Design layer components provide recovery paths.

## ErrorCard for Page Errors

\`\`\`tsx
export function ErrorCard({ error, reset, title, description }) {
  return (
    <Card className="text-center">
      <AlertCircle className="text-destructive" />
      <CardTitle>{title}</CardTitle>
      <Button onClick={reset}>Try again</Button>
    </Card>
  );
}
\`\`\`

## ErrorBoundary for Inline Errors

\`\`\`tsx
<ErrorBoundary label="Failed to load posts" fullWidth>
  <PostList searchParams={searchParams} />
</ErrorBoundary>
\`\`\`

## error.tsx Uses ErrorCard

\`\`\`tsx
'use client';

export default function PostError({ error, reset }) {
  useTrackError(error);  // Log errors separately
  return <ErrorCard error={error} reset={reset} />;
}
\`\`\`

## StatusCard for not-found.tsx

\`\`\`tsx
<StatusCard icon={FileQuestion} title="Post Not Found" description="...">
  <BackButton href="/dashboard">Back to posts</BackButton>
</StatusCard>
\`\`\`

Design components own visuals. Route files become thin wrappers.`,
        description: 'ErrorCard, ErrorBoundary, StatusCard design components.',
        published: true,
        slug: 'error-handling',
        title: 'Error Handling Patterns',
      },
      {
        content: `# generateStaticParams

The best in-between state is **none at all**. Pre-rendered pages load instantly.

## Basic Usage

\`\`\`tsx
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(post => ({ slug: post.slug }));
}
\`\`\`

## Dynamic Metadata

\`\`\`tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  return { title: post.title, description: post.description };
}
\`\`\`

New slugs are generated on-demand and cached. Use \`revalidateTag()\` to invalidate when content changes.`,
        description: 'Pre-render dynamic routes, generateMetadata for SEO.',
        published: true,
        slug: 'generatestaticparams',
        title: 'generateStaticParams',
      },
      {
        content: `# URL State with searchParams

URL-driven state creates clear causality: tab click → URL changes → Suspense shows skeleton → new data arrives.

Makes state shareable and bookmarkable—\`/dashboard?filter=drafts&sort=title\` shows exactly that view.

## Reading searchParams

\`\`\`tsx
export async function PostList({ searchParams }) {
  const { filter, sort } = await searchParams;
  const posts = await getPosts(filter, sort);
  // ...
}
\`\`\`

## Updating URL State

\`\`\`tsx
'use client';

function tabAction(value: string) {
  router.push(\`/dashboard?filter=\${value}&sort=\${currentSort}\`);
}

return <TabList activeTab={currentTab} changeAction={tabAction} />;
\`\`\`

## Cycle Button

\`\`\`tsx
const [optimisticSort, setOptimisticSort] = useOptimistic(currentSort);

function sortAction() {
  startTransition(() => {
    setOptimisticSort(nextSort);
    router.push(\`/dashboard?sort=\${nextSort}\`);
  });
}
\`\`\`

URL state works with browser history and makes pages shareable.`,
        description: 'Shareable filter/sort state, optimistic URL updates.',
        published: true,
        slug: 'url-state-searchparams',
        title: 'URL State with searchParams',
      },
      {
        content: `# React cache()

Duplicate requests extend loading time. React's \`cache()\` deduplicates requests within a single render pass.

## The Pattern

\`\`\`tsx
export const getPostBySlug = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();
  return post;
});
\`\`\`

Multiple components can call \`getPostBySlug(slug)\`—only one query executes.

## Combining with "use cache"

\`\`\`tsx
export const getPublishedPostBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(\`post-\${slug}\`);
  return await prisma.post.findUnique({ where: { slug } });
});
\`\`\`

\`cache()\` deduplicates within a render. \`"use cache"\` caches across requests.`,
        description: 'Request deduplication within render, combining with "use cache".',
        published: true,
        slug: 'react-cache',
        title: 'cache() for Deduplication',
      },
      {
        content: `# useTransition

For destructive actions, users need immediate feedback and prevention from double-clicking.

## The Pattern

\`\`\`tsx
'use client';

export function DeletePostButton({ slug }) {
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

\`isPending\` becomes true immediately and stays true until the action and navigation complete.

## State Updates After Await

\`\`\`tsx
startTransition(async () => {
  await someAsyncFunction();
  startTransition(() => setState('done')); // Nested transition needed
});
\`\`\``,
        description: 'isPending for destructive actions, nested startTransition pattern.',
        published: true,
        slug: 'usetransition',
        title: 'useTransition for Pending UI',
      },
      {
        content: `# Skeleton Loading

Spinners say "something is happening." **Skeletons say "this is what's coming."**

Skeletons reduce perceived loading time and prevent layout shift.

## Co-locate with Components

\`\`\`tsx
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

## Use with Suspense

\`\`\`tsx
<Suspense fallback={<PostListSkeleton />}>
  <PostList searchParams={searchParams} />
</Suspense>
\`\`\`

Keep skeletons next to their components—when you change the layout, the skeleton is right there to update.`,
        description: 'Co-locate skeletons, match layout structure.',
        published: true,
        slug: 'skeleton-loading',
        title: 'Skeleton Co-location Pattern',
      },
      {
        content: `# Authorization Patterns

\`unauthorized()\` triggers a dedicated page instead of a generic error.

## In Server Components

\`\`\`tsx
export default function DashboardPage() {
  if (!canManagePosts()) unauthorized();
  return <Dashboard />;
}
\`\`\`

## unauthorized.tsx

\`\`\`tsx
export default function Unauthorized() {
  return (
    <StatusCard icon={LockKeyhole} title="Unauthorized" description="...">
      <Link href="/">Back to Blog</Link>
    </StatusCard>
  );
}
\`\`\`

## In Server Functions

\`\`\`tsx
export async function deletePost(slug: string) {
  if (!canManagePosts()) throw new Error('Unauthorized');
  await prisma.post.delete({ where: { slug } });
}
\`\`\``,
        description: 'unauthorized() for auth, StatusCard for UI.',
        published: true,
        slug: 'authorization',
        title: 'Authorization with unauthorized()',
      },
      {
        content: `# Static vs Dynamic Rendering

Static pages have no in-between state—content is ready. Dynamic pages need Suspense boundaries.

With \`cacheComponents: true\`, Next.js defaults to dynamic. Opt into static with \`"use cache"\`.

## What Makes a Page Dynamic?

- Reading \`searchParams\` or \`params\`
- Calling \`cookies()\` or \`headers()\`
- Data fetches without \`"use cache"\`

## Static Example

\`\`\`tsx
const posts = await getPublishedPosts(); // Uses "use cache"
\`\`\`

No Suspense needed—content is cached.

## Dynamic Example

\`\`\`tsx
<Suspense fallback={<PostListSkeleton />}>
  <PostList searchParams={searchParams} />
</Suspense>
\`\`\`

\`searchParams\` triggers dynamic rendering with Suspense fallbacks.`,
        description: 'Static vs dynamic rendering, when Suspense is needed.',
        published: true,
        slug: 'static-vs-dynamic',
        title: 'Static vs Dynamic Rendering',
      },
      {
        content: `# The Action Prop Pattern

Design components should own their in-between states internally—not push complexity to consumers.

## The Pattern

\`\`\`tsx
'use client';

export function TabList({ tabs, activeTab, changeAction }) {
  const [optimisticTab, setOptimisticTab] = useOptimistic(activeTab);
  const [isPending, startTransition] = useTransition();

  function handleTabChange(value: string) {
    startTransition(async () => {
      setOptimisticTab(value);
      await changeAction?.(value);
    });
  }

  return (
    <Tabs value={optimisticTab}>
      <TabsList>...</TabsList>
      {isPending && <Loader2 className="animate-spin" />}
    </Tabs>
  );
}
\`\`\`

The component handles optimistic updates, pending state, and transitions. Parent just passes the action:

\`\`\`tsx
<TabList activeTab={currentTab} changeAction={value => router.push(\`?filter=\${value}\`)} />
\`\`\`

## Naming Convention

Use suffixes: \`changeAction\`, \`submitAction\`, \`deleteAction\`.`,
        description: 'Design components own transitions, parent passes action.',
        published: true,
        slug: 'action-prop-pattern',
        title: 'The Action Prop Pattern',
      },
      {
        content: `# useLinkStatus for Link Pending State

\`useLinkStatus\` provides pending state for \`<Link>\` navigations. Must be used inside a Link descendant.

## The Pattern

\`\`\`tsx
'use client';

function SortIndicator({ icon: Icon, label }) {
  const { pending } = useLinkStatus();
  return (
    <>
      {pending ? <Loader2 className="animate-spin" /> : <Icon />}
      <span>{label}</span>
    </>
  );
}

export function SortButton() {
  return (
    <Link href="/dashboard?sort=newest">
      <SortIndicator icon={ArrowUpDown} label="Newest" />
    </Link>
  );
}
\`\`\`

## vs useTransition

| Approach | Use When |
|----------|----------|
| \`useLinkStatus\` | Simple navigation feedback, declarative |
| \`useTransition\` | Need optimistic updates, imperative control |`,
        description: 'Link pending state, child component pattern.',
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
