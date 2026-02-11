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

**Server Components** determine *what* loads—they're async, fetch data directly, and render on the server. **Client Components** handle *how users interact* during mutations—optimistic updates, pending indicators, form state.

## Server Components: Data Fetching

From \`app/page.tsx\`:

\`\`\`tsx
async function BlogList() {
  const posts = await getPublishedPosts();
  return posts.map(post => <Card key={post.slug}>{post.title}</Card>);
}
\`\`\`

No loading state management needed—Suspense handles that declaratively.

## Client Components: Interactions

Add \`'use client'\` when you need hooks or event handlers. This is where you coordinate mutation feedback.

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
        setOptimisticArchived(!optimisticArchived);
        await toggleArchivePost(slug, !optimisticArchived);
      }}
    >
      <button>{optimisticArchived ? 'Unarchive' : 'Archive'}</button>
    </form>
  );
}
\`\`\`

## Propagating State with CSS :has()

The \`data-pending\` attribute bridges Client and Server Component styling. Parent Server Components can react to child pending states:

\`\`\`tsx
// PostList.tsx (Server Component)
<Card className="has-data-pending:animate-pulse has-data-pending:bg-muted/70">
  <ArchiveButton slug={post.slug} archived={post.archived} />
</Card>
\`\`\`

Tailwind's \`has-data-pending:\` maps to CSS \`:has([data-pending])\`. The Card pulses during the archive action—no Client Component needed.

## The Principle

Keep Client Components at the leaves. Server Components handle layout and data; Client Components handle the interactive in-between states.`,
        description: 'Server vs Client Components, CSS :has() for parent styling, data-pending attribute pattern.',
        published: true,
        slug: 'react-server-components',
        title: 'When to Use Client Components',
      },
      {
        content: `# Streaming with Suspense

Without Suspense, users see blank screens while data loads. With it, you **design** what they see—skeleton placeholders that indicate progress, not emptiness.

Each Suspense boundary is a design decision: "What should users see while this section loads?"

## Independent Streaming

From \`app/dashboard/page.tsx\`:

\`\`\`tsx
export default function DashboardPage({ searchParams }) {
  return (
    <>
      <Suspense fallback={<PostTabsSkeleton />}>
        <PostTabs />
      </Suspense>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </>
  );
}
\`\`\`

Separate boundaries let sections stream independently. Tabs render before posts—users see progress instead of a blank page.

## Boundary Placement

Ask: "How should this load?" The answer determines where boundaries go:

| Scenario | Strategy |
|----------|----------|
| Related content | Single boundary, load together |
| Independent sections | Separate boundaries, stream in parallel |
| Critical UI (header, nav) | Outside boundaries, always visible |

## Co-locating Skeletons

Export skeletons alongside their components. From \`app/dashboard/_components/PostList.tsx\`:

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

When the layout changes, the skeleton is right there to update.

## Transitions Keep Content Visible

Suspense fallbacks appear on initial load. During navigation, wrapping updates in \`startTransition\` keeps existing content visible while new data loads—preventing the fallback from appearing again.`,
        description: 'Streaming with Suspense boundaries, co-locating skeletons, transition behavior.',
        published: true,
        slug: 'suspense-and-streaming',
        title: 'Streaming with Suspense',
      },
      {
        content: `# Server Functions

Forms are the classic in-between state challenge. User clicks submit—then what? A frozen button? A spinner? What if validation fails?

Server Functions (\`"use server"\`) handle the mutation lifecycle: validation, database writes, cache invalidation, and error recovery.

## The Pattern

From \`data/actions/post.ts\`:

\`\`\`tsx
'use server';

export async function createPost(formData: FormData): Promise<ActionResult> {
  const rawData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
  };

  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message, formData: rawData, success: false };
  }

  await prisma.post.create({ data: result.data });
  revalidateTag('posts', 'max');
  refresh();
  return { success: true };
}
\`\`\`

## Preserving Input on Errors

The worst form UX: validation fails and everything clears. Return submitted data so forms can repopulate:

\`\`\`tsx
export type ActionResult =
  | { success: true }
  | { success: false; error: string; formData?: FormValues };
\`\`\`

Users shouldn't lose their work.

## Immediate Cache Updates

After mutations, users expect to see results immediately:

\`\`\`tsx
revalidateTag('posts', 'max');      // Stale-while-revalidate for other users
revalidateTag(\`post-\${slug}\`, 'max'); // Invalidate specific post
refresh();                           // Immediate update for current user
\`\`\`

The combination of \`revalidateTag\` + \`refresh\` ensures the current user sees changes instantly while other users get efficient background revalidation.`,
        description: 'Server Functions with validation, error recovery, and cache invalidation patterns.',
        published: true,
        slug: 'server-functions',
        title: 'Server Functions',
      },
      {
        content: `# useActionState

The worst form experience: submit, validation fails, and all your input disappears. \`useActionState\` prevents this by managing state across submissions.

## Preserving Input on Errors

From \`app/dashboard/_components/PostForm.tsx\`:

\`\`\`tsx
'use client';

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
      <Input name="title" defaultValue={state.title} />
      <Textarea name="content" defaultValue={state.content} />
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}
\`\`\`

When validation fails, the Server Function returns \`formData\`. The hook updates \`state\`, inputs repopulate. Users can fix the issue and retry without retyping.

## Reusing for Create and Edit

One component handles both cases:

\`\`\`tsx
// Create - empty defaults
<PostForm action={createPost} defaultValues={{ title: '', content: '' }} />

// Edit - bind the slug, prefill with existing data
<PostForm action={updatePost.bind(null, post.slug)} defaultValues={post} />
\`\`\`

Same component, different actions, consistent error recovery.

## The Flow

1. User submits form
2. \`formAction\` wraps the submission in a transition (automatic pending state)
3. Server Function validates and returns \`{ success: false, formData }\` on error
4. \`state\` updates with the returned data
5. Form inputs repopulate via \`defaultValue={state.field}\``,
        description: 'Preserve form input on validation errors, reuse forms for create and edit.',
        published: true,
        slug: 'useactionstate',
        title: 'useActionState for Forms',
      },
      {
        content: `# useFormStatus

Feedback should be **localized**. When clicking a submit button, the indicator belongs in that button—not a full-page spinner somewhere else.

\`useFormStatus\` provides the pending state of the nearest parent form, enabling reusable submit buttons that handle their own loading state.

## The SubmitButton Pattern

From \`components/design/SubmitButton.tsx\`:

\`\`\`tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <span className="flex items-center gap-2">
          {children}
          <Loader2 className="size-4 animate-spin" />
        </span>
      ) : children}
    </Button>
  );
}
\`\`\`

Drop it in any form—no prop drilling, no manual state tracking.

## The Child Constraint

The hook must be called from a **child** of the form:

\`\`\`tsx
// ❌ Won't work - hook is outside the form
function Form() {
  const { pending } = useFormStatus();
  return <form>...</form>;
}

// ✅ Works - SubmitButton is inside the form
<form action={formAction}>
  <SubmitButton>Save</SubmitButton>
</form>
\`\`\`

React tracks which form triggered the submission. Calling the hook inside a form's children ensures it returns the correct pending state.

## The Principle

Feedback should match the scope of the action. Button click → button feedback. Navigation → page-level indicator. \`useFormStatus\` keeps form feedback where it belongs.`,
        description: 'SubmitButton pattern, localized feedback, child component constraint.',
        published: true,
        slug: 'useformstatus',
        title: 'useFormStatus',
      },
      {
        content: `# useOptimistic

The best in-between state is **no perceived delay at all**. Optimistic updates show the result immediately while the action runs in the background.

\`useOptimistic\` makes this pattern easy—especially for actions with high success rates like toggles.

## Example: ArchiveButton

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

Expose pending state via \`data-pending\` attribute. Parent Server Components can style based on this:

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

## When to Use

Best for actions with high success rates: toggles, likes, bookmarks. Avoid for operations that commonly fail—users see confusing rollbacks.`,
        description: 'Deriving pending state from optimistic vs real value, data-pending for parent styling.',
        published: true,
        slug: 'useoptimistic',
        title: 'useOptimistic for Instant Feedback',
      },
      {
        content: `# The "use cache" Directive

Caching eliminates in-between states entirely—if content is pre-rendered, there's nothing to wait for. Next.js 16 introduces \`"use cache"\` for fine-grained control over what gets cached.

With \`cacheComponents: true\`, data fetching is **dynamic by default**—you opt into caching explicitly.

## Basic Usage

From \`data/queries/post.ts\`:

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

After mutations, the cache needs updating. Use \`revalidateTag\` with a profile plus \`refresh()\` for immediate UI updates:

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

Tag individual items for surgical invalidation:

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

Route changes are a unique in-between state—the old page is leaving, the new one is arriving. Without animation, this handoff feels abrupt: content disappears, then reappears somewhere else. Users lose spatial context.

**View Transitions** bridge this gap. They animate the change, showing users *where* content went and *where* new content came from. Navigation becomes continuous rather than fragmented.

React's \`<ViewTransition>\` component wraps the browser's View Transitions API.

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

Errors are an in-between state we hope users never see—but they will. Well-designed error boundaries provide **recovery paths** instead of dead ends.

Next.js provides file conventions for handling errors automatically. Design layer components keep the UX consistent.

## The Design Layer

From \`components/design/ErrorCard.tsx\`—a reusable card for page-level errors:

\`\`\`tsx
export function ErrorCard({ error, reset, title, description }: Props) {
  return (
    <Card className="text-center">
      <CardHeader>
        <AlertCircle className="text-destructive size-8" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description || error.message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset}>Try again</Button>
      </CardContent>
    </Card>
  );
}
\`\`\`

From \`components/design/ErrorBoundary.tsx\`—for inline/localized errors:

\`\`\`tsx
<ErrorBoundary label="Failed to load posts" fullWidth>
  <Suspense fallback={<PostListSkeleton />}>
    <PostList searchParams={searchParams} />
  </Suspense>
</ErrorBoundary>
\`\`\`

## error.tsx Uses ErrorCard

From \`app/dashboard/[slug]/error.tsx\`:

\`\`\`tsx
'use client';

import { ErrorCard } from '@/components/design/ErrorCard';
import { useTrackError } from '@/lib/useTrackError';

export default function PostError({ error, reset }: Props) {
  useTrackError(error);
  return <ErrorCard error={error} reset={reset} description="..." />;
}
\`\`\`

The \`useTrackError\` hook handles logging separately—keeping ErrorCard pure presentation.

## not-found.tsx Uses StatusCard

From \`app/dashboard/[slug]/not-found.tsx\`:

\`\`\`tsx
import { StatusCard } from '@/components/design/StatusCard';

export default function PostNotFound() {
  return (
    <StatusCard
      icon={FileQuestion}
      title="Post Not Found"
      description="The post you're looking for doesn't exist."
    >
      <BackButton href="/dashboard">Back to posts</BackButton>
    </StatusCard>
  );
}
\`\`\`

## The Pattern

Design components own the visual treatment. Route files become thin wrappers that pass context-specific props.`,
        description: 'ErrorCard, ErrorBoundary, StatusCard design components for error UX.',
        published: true,
        slug: 'error-handling',
        title: 'Error Handling Patterns',
      },
      {
        content: `# generateStaticParams

The best in-between state is **none at all**. When pages are pre-rendered at build time, users see content immediately.

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

When filters change, data must reload. The question is: **where does the loading state appear?**

URL-driven state creates clear causality: clicking a tab → URL changes → Suspense boundary shows skeleton → new data arrives. Users understand *why* they're waiting because the action (tab click) and the result (new content) are visibly connected.

This pattern also makes state shareable and bookmarkable—\`/dashboard?filter=drafts&sort=title\` shows exactly that view.

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

Every duplicate request extends the loading state. If three components fetch the same post, users wait for three round trips.

React's \`cache()\` solves this—it deduplicates requests within a single render pass. Call the same function from multiple components, get one network request. Shorter loading time means better in-between states.

## Example: getPostBySlug

From \`data/queries/post.ts\`:

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

Destructive actions need clear in-between states. When deleting a post, users should see **immediate feedback** that something is happening—and be prevented from clicking again.

\`useTransition\` marks state updates as non-urgent, keeping your UI responsive during operations.

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

Loading spinners say "something is happening." **Skeletons say "this is what's coming."**

By showing the shape of content before it arrives, skeletons accomplish two things: they reduce *perceived* loading time (progress feels faster when you can see the destination), and they prevent layout shift (content slots into the space already reserved for it).

The key is matching the skeleton to the actual layout.

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

Authorization failures are error states that deserve their own UI. Instead of a generic error, \`unauthorized()\` triggers a dedicated page explaining what went wrong and how to fix it.

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

From \`app/dashboard/unauthorized.tsx\`—uses the StatusCard design component:

\`\`\`tsx
import { StatusCard } from '@/components/design/StatusCard';

export default function Unauthorized() {
  return (
    <StatusCard
      icon={LockKeyhole}
      title="Unauthorized"
      description="You need to be logged in to access the dashboard."
    >
      <Link href="/">Back to Blog</Link>
    </StatusCard>
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
        description: 'unauthorized() in Server Components, StatusCard for auth UI, protecting Server Functions.',
        published: true,
        slug: 'authorization',
        title: 'Authorization with unauthorized()',
      },
      {
        content: `# Static vs Dynamic Rendering

Understanding when pages are static vs dynamic determines **when loading states appear**. Static pages have no in-between state—content is ready. Dynamic pages need Suspense boundaries to show skeletons while fetching.

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

Design systems should **own their in-between states**. When a TabList receives an async action, it should handle the pending state, optimistic updates, and spinner internally—not push that complexity to every consumer.

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

Navigation isn't instant. When a Link click triggers loading, users need feedback. \`useLinkStatus\` provides a pending state specifically for \`<Link>\` navigations—no transition management required.

The hook must be used inside a descendant component of \`Link\`.

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
