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
  await prisma.example.deleteMany();

  // Example seed data - replace with your own
  await prisma.example.createMany({
    data: [{ name: 'Example 1' }, { name: 'Example 2' }, { name: 'Example 3' }],
  });

  // Seed posts
  await prisma.post.createMany({
    data: [
      {
        content: `# React Server Components

In Next.js App Router, all components are Server Components by default. They render on the server and send HTML to the client with zero JavaScript bundle cost.

This is a fundamental shift from traditional React where components run in the browser. Server Components can directly access databases, file systems, and other backend resources without exposing sensitive information to the client.

## When to Use Server Components

Server Components are ideal when you need to fetch data, access backend resources, or keep sensitive information secure. Since they never run in the browser, API keys and database queries stay on the server.

In this blog, the post page fetches data directly in the component:

\`\`\`tsx
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  return (
    <article>
      <MarkdownContent>{post.content}</MarkdownContent>
    </article>
  );
}
\`\`\`

No API route needed. This simplifies data fetching and eliminates client-server waterfalls.

## When to Use Client Components

Add \`'use client'\` at the top of a file when you need interactivity—event handlers, React hooks like \`useState\`, or browser APIs.

The archive button in the dashboard needs click handlers and state, so it's a Client Component:

\`\`\`tsx
'use client';

export function ArchiveButton({ slug, archived }) {
  function handleClick() {
    // Handle the click...
  }
  return <button onClick={handleClick}>Archive</button>;
}
\`\`\`

## The Composition Pattern

Server Components can import and render Client Components, but not vice versa. Keep Client Components at the leaves of your component tree and pass server-fetched data as props. This maximizes server rendering while enabling interactivity where needed.`,
        description: 'Understand when to use Server Components vs Client Components in Next.js App Router.',
        published: true,
        slug: 'react-server-components',
        title: 'React Server Components',
      },
      {
        content: `# Suspense and Streaming

Suspense lets you declaratively specify loading UI while async content loads. In Next.js, this enables streaming—sending HTML to the browser in chunks as each part becomes ready.

Without streaming, users would see nothing until the entire page loads. With streaming, the shell appears immediately while slower content loads progressively.

## How Streaming Works

When a component wrapped in Suspense needs to fetch data, React shows the fallback immediately. Once the data resolves, the content streams to the browser and replaces the fallback.

The dashboard page wraps async components in Suspense:

\`\`\`tsx
export default function DashboardPage({ searchParams }: Props) {
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

The tabs and list load independently—whichever finishes first appears first.

## The loading.tsx Convention

Next.js provides a file convention that automatically wraps your page in Suspense. Create a \`loading.tsx\` alongside your \`page.tsx\`:

\`\`\`tsx
export default function PostLoading() {
  return (
    <article>
      <Skeleton className="h-5 w-96" />
      <Skeleton className="h-64 w-full" />
    </article>
  );
}
\`\`\`

This is equivalent to wrapping your page in \`<Suspense fallback={<PostLoading />}>\`.

## Nested Suspense Boundaries

For more granular control, nest multiple Suspense boundaries within a single page. Each section loads independently—fast queries resolve first while slow ones continue streaming.`,
        description: 'Learn how Suspense enables streaming HTML and progressive loading in Next.js.',
        published: true,
        slug: 'suspense-and-streaming',
        title: 'Suspense and Streaming',
      },
      {
        content: `# Server Actions

Server Actions are async functions that run on the server. They're the recommended way to handle form submissions and data mutations in Next.js.

Unlike API routes, Server Actions can be called directly from components. They integrate with React's form handling and provide automatic CSRF protection.

## Defining a Server Action

Create a file with \`'use server'\` at the top. Every exported function becomes a Server Action:

\`\`\`tsx
'use server';

import { updateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await prisma.post.create({
    data: { title, content, slug: generateSlug(title) },
  });

  updateTag('posts');
  return { success: true };
}
\`\`\`

The \`updateTag\` call invalidates cached data so the UI reflects the change.

## Using with Forms

Pass the action directly to a form's \`action\` prop:

\`\`\`tsx
<form action={createPost}>
  <input name="title" required />
  <textarea name="content" required />
  <button type="submit">Create</button>
</form>
\`\`\`

This works without JavaScript—the form submits normally if JS fails to load. When JS is available, React handles the submission without a page reload.

## Returning Data

Server Actions can return validation errors, success messages, or created records. Use \`useActionState\` to access this returned data in Client Components.`,
        description: 'Learn how to define and use Server Actions for mutations in Next.js.',
        published: true,
        slug: 'server-actions',
        title: 'Server Actions',
      },
      {
        content: `# useActionState

\`useActionState\` is a React hook that manages form state across submissions. It's useful when you need to preserve user input after validation errors.

## The Problem

Without \`useActionState\`, form state resets on each submission. If validation fails server-side, users lose their input.

## Basic Usage

The hook wraps your Server Action and provides the current state plus a bound action:

\`\`\`tsx
'use client';

import { useActionState } from 'react';

export function PostForm({ action, defaultValues }) {
  const [state, formAction] = useActionState(async (prevState, formData) => {
    const result = await action(formData);
    if (result.success) {
      return prevState;
    }
    return result.formData ?? prevState;
  }, defaultValues);

  return (
    <form action={formAction}>
      <input name="title" defaultValue={state.title} />
      <button type="submit">Save</button>
    </form>
  );
}
\`\`\`

When the action returns \`formData\` on error, the form repopulates with the user's input.

## Returning Errors

Structure your Server Action to return both the error and submitted data:

\`\`\`tsx
export async function createPost(formData: FormData) {
  const rawData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
  };

  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message, formData: rawData };
  }

  await prisma.post.create({ data: result.data });
  return { success: true };
}
\`\`\`

This pattern ensures users never lose their work on validation errors.`,
        description: 'Manage form state across submissions with useActionState.',
        published: true,
        slug: 'useactionstate',
        title: 'useActionState',
      },
      {
        content: `# useFormStatus

\`useFormStatus\` provides the pending state of the nearest parent form. It's the simplest way to show loading indicators during form submissions.

## Basic Usage

The hook returns a \`pending\` boolean that's true while submitting:

\`\`\`tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : children}
    </button>
  );
}
\`\`\`

## The Child Component Constraint

\`useFormStatus\` only works in components that are children of the form. It won't work in the same component that renders the form:

\`\`\`tsx
// ❌ Always returns pending: false
function Form() {
  const { pending } = useFormStatus();
  return <form>...</form>;
}

// ✅ Works correctly
function Form() {
  return (
    <form action={myAction}>
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}
\`\`\`

Extract the button into a child component, then use the hook there.

## Why This Design?

React needs to track which form triggered the submission. By requiring the hook inside a form's children, React can reliably determine the pending state for that specific form.`,
        description: 'Show loading states during form submissions with useFormStatus.',
        published: true,
        slug: 'useformstatus',
        title: 'useFormStatus',
      },
      {
        content: `# useOptimistic

\`useOptimistic\` provides immediate UI feedback while an action runs in the background. It shows a temporary "optimistic" value until the real data arrives.

This creates snappy interfaces where users see instant responses.

## The Pattern

Use \`useOptimistic\` with a form action to update UI immediately. The archive button in the dashboard uses this pattern:

\`\`\`tsx
'use client';

import { useOptimistic } from 'react';

export function ArchiveButton({ slug, archived }) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived);

  return (
    <form
      action={async () => {
        setOptimisticArchived(!optimisticArchived);
        await toggleArchivePost(slug, !optimisticArchived);
      }}
    >
      <button type="submit">
        {optimisticArchived ? 'Unarchive' : 'Archive'}
      </button>
    </form>
  );
}
\`\`\`

## How It Works

1. User submits the form
2. \`setOptimisticArchived\` immediately updates the UI with the optimistic value
3. The Server Action runs in the background
4. When the action completes, the parent re-renders with new data
5. The optimistic value is replaced by the real \`archived\` prop

If the action fails, the server state doesn't change, so when the component re-renders it receives the original prop value—effectively "reverting" the UI.

## Why Form Actions?

Using the form \`action\` prop lets React manage the async lifecycle. React knows when the action starts and finishes, which is required for the optimistic state to work correctly.

Note: This pattern requires JavaScript. The inline async function is client-side code, not a Server Action that would work without JS.

Use optimistic updates for actions with high success rates: toggles, likes, bookmarks.`,
        description: 'Implement instant UI feedback with useOptimistic.',
        published: true,
        slug: 'useoptimistic',
        title: 'useOptimistic',
      },
      {
        content: `# The "use cache" Directive

Next.js 16 introduces the \`"use cache"\` directive for fine-grained caching control. Unlike previous versions where caching was implicit, you now explicitly opt into caching.

## Enabling Cache Components

Enable the feature in your Next.js config:

\`\`\`tsx
const nextConfig = {
  cacheComponents: true,
};
\`\`\`

With this enabled, data fetching is **dynamic by default**. Use \`"use cache"\` to opt into caching.

## Push Dynamic Data Down

The key pattern: push dynamic data access (\`searchParams\`, \`cookies()\`, \`headers()\`, uncached fetches) as deep as possible in your component tree. This maximizes static content.

\`\`\`tsx
// ❌ Dynamic at page level - entire page is dynamic
export default async function DashboardPage({ searchParams }) {
  const { filter } = await searchParams;
  const posts = await getPosts(filter);
  return <PostList posts={posts} />;
}

// ✅ Dynamic pushed down - page shell is static
export default function DashboardPage({ searchParams }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
\`\`\`

The dashboard uses this pattern. The page shell renders statically while \`PostList\` streams in with the filtered data.

## Basic Usage

Add \`"use cache"\` to functions you want cached:

\`\`\`tsx
import { cacheTag } from 'next/cache';

export const getPublishedPosts = cache(async () => {
  'use cache';
  cacheTag('posts');

  return await prisma.post.findMany({
    where: { published: true },
  });
});
\`\`\`

The \`cacheTag\` function tags this data for later invalidation.

## Cache Invalidation

When data changes, invalidate with \`updateTag\`:

\`\`\`tsx
export async function createPost(formData: FormData) {
  await prisma.post.create({ data });
  updateTag('posts');
}
\`\`\`

All functions tagged with \`'posts'\` will refetch on the next request.

## Granular Tags

Tag individual items separately from lists:

\`\`\`tsx
export const getPublishedPostBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(\`post-\${slug}\`);

  return await prisma.post.findUnique({ where: { slug } });
});
\`\`\`

When updating a post, invalidate both its specific tag and the list tag.`,
        description: 'Control caching with the "use cache" directive and cache tags.',
        published: true,
        slug: 'use-cache-directive',
        title: 'The "use cache" Directive',
      },
      {
        content: `# View Transitions

React 19 introduces the \`<ViewTransition>\` component for smooth animations between route changes. Instead of abrupt page swaps, elements can morph, fade, or slide.

## Page-Level Transitions

Wrap page content with enter/exit animations:

\`\`\`tsx
import { ViewTransition } from 'react';

export default function HomePage() {
  return (
    <ViewTransition enter="slide-from-left" exit="slide-to-left">
      <div>
        <h1>Blog</h1>
        <BlogList />
      </div>
    </ViewTransition>
  );
}
\`\`\`

## Shared Element Transitions

Connect elements across pages with the same \`name\`. The blog uses this for post cards:

\`\`\`tsx
<Link href={\`/dashboard/\${post.slug}\`}>
  <ViewTransition name={\`post-card-\${post.slug}\`} share="morph">
    <Card>
      <CardTitle>{post.title}</CardTitle>
    </Card>
  </ViewTransition>
</Link>
\`\`\`

On the detail page, use the same name:

\`\`\`tsx
<ViewTransition name={\`post-card-\${slug}\`} share="morph">
  <article>
    <PostHeader slug={slug} />
  </article>
</ViewTransition>
\`\`\`

The card smoothly morphs into the full article.

## Browser Support

View Transitions use the browser's native API. In unsupported browsers, navigation works normally—a progressive enhancement that improves experience where supported.`,
        description: 'Add smooth page transitions with the ViewTransition component.',
        published: true,
        slug: 'view-transitions',
        title: 'View Transitions',
      },
      {
        content: `# Error Handling

Next.js provides file conventions for handling errors. Instead of try-catch blocks, create special files that automatically catch errors in their route segment.

## error.tsx

Create an \`error.tsx\` file to catch errors:

\`\`\`tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

Error boundaries must be Client Components. The \`reset\` function attempts to re-render the error boundary's contents.

## not-found.tsx

Handle missing resources with \`not-found.tsx\`:

\`\`\`tsx
export default function PostNotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>The post you're looking for doesn't exist.</p>
    </div>
  );
}
\`\`\`

Trigger it with \`notFound()\`:

\`\`\`tsx
import { notFound } from 'next/navigation';

export const getPostBySlug = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();
  return post;
});
\`\`\`

## Error Hierarchy

Errors bubble up to the nearest error boundary. Create \`error.tsx\` at different levels for granular handling—a post-specific error page might offer different recovery options than a general dashboard error.`,
        description: 'Handle errors with error.tsx and not-found.tsx conventions.',
        published: true,
        slug: 'error-handling',
        title: 'Error Handling',
      },
      {
        content: `# generateStaticParams

\`generateStaticParams\` pre-renders dynamic routes at build time. For a blog, posts are ready as static HTML before any user visits—instant page loads, no loading states.

## Basic Usage

Export the function from a dynamic route:

\`\`\`tsx
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  return <MarkdownContent>{post.content}</MarkdownContent>;
}
\`\`\`

At build time, Next.js calls \`generateStaticParams\` to get all values, then pre-renders a page for each.

## Dynamic Metadata

Combine with \`generateMetadata\` for SEO:

\`\`\`tsx
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  return {
    title: post.title,
    description: post.description,
  };
}
\`\`\`

## New Content After Build

When a user requests a slug not in \`generateStaticParams\`, Next.js generates it on-demand and caches it. Use \`updateTag()\` in Server Actions to invalidate when content changes.

## When to Use

Use for public, content-heavy pages. Admin pages and user-specific content are better served dynamically.`,
        description: 'Pre-render dynamic routes at build time for instant page loads.',
        published: true,
        slug: 'generatestaticparams',
        title: 'generateStaticParams',
      },
      {
        content: `# URL State with searchParams

URL search parameters provide shareable, bookmarkable state. Unlike React state that resets on refresh, URL state persists and can be shared via links.

## Reading searchParams

In Next.js 16, \`searchParams\` is a Promise:

\`\`\`tsx
type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default function DashboardPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostList searchParams={searchParams} />
    </Suspense>
  );
}
\`\`\`

The PostList component awaits and validates the filter:

\`\`\`tsx
const filterSchema = z.enum(['all', 'published', 'drafts', 'archived']).catch('all');

export async function PostList({ searchParams }: Props) {
  const { filter } = await searchParams;
  const validFilter = filterSchema.parse(filter);
  const posts = await getPosts(validFilter);
  // ...
}
\`\`\`

## Updating URL State

In Client Components, use \`useRouter\`:

\`\`\`tsx
'use client';

export function PostTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('filter') ?? 'all';

  function tabAction(value: string) {
    router.push(\`/dashboard?filter=\${value}\`);
  }

  return <TabList activeTab={currentTab} changeAction={tabAction} />;
}
\`\`\`

## Benefits

URL state works with browser history, can be bookmarked, and makes pages shareable. \`/dashboard?filter=drafts\` shows exactly that filtered view.`,
        description: 'Use URL searchParams for shareable, bookmarkable filter state.',
        published: true,
        slug: 'url-state-searchparams',
        title: 'URL State with searchParams',
      },
      {
        content: `# React cache()

React's \`cache()\` function deduplicates requests within a single render pass. Call the same function multiple times with the same arguments, and only one execution happens.

## The Problem

When multiple components need the same data:

\`\`\`tsx
async function PostHeader({ slug }) {
  const post = await getPostBySlug(slug);
  return <h1>{post.title}</h1>;
}

async function PostContent({ slug }) {
  const post = await getPostBySlug(slug);
  return <MarkdownContent>{post.content}</MarkdownContent>;
}
\`\`\`

Without deduplication, this makes two database queries.

## The Solution

Wrap your function with \`cache()\`:

\`\`\`tsx
import { cache } from 'react';

export const getPostBySlug = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();
  return post;
});
\`\`\`

Now both components call \`getPostBySlug(slug)\` independently, but only one query executes.

## How It Works

React tracks function calls during a render. When \`cache(fn)\` is called with the same arguments, it returns the cached result. This deduplication only applies within a single request.

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
        description: 'Deduplicate data requests with React cache().',
        published: true,
        slug: 'react-cache',
        title: 'React cache()',
      },
      {
        content: `# useTransition

\`useTransition\` marks state updates as non-urgent, keeping your UI responsive during expensive operations.

## The Problem

When users trigger an action, the UI should respond immediately. But if the action takes time (like a Server Action with a database call), the interface can freeze while React processes.

## Basic Usage

\`useTransition\` returns a pending state and a function to wrap updates:

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

The delete button in the dashboard uses this pattern. When clicked, \`isPending\` becomes true immediately, and stays true until both the Server Action and navigation complete.

## How It Works

1. User clicks delete
2. \`startTransition\` wraps the async operation
3. \`isPending\` becomes true immediately
4. The UI stays responsive (button shows "Deleting...")
5. Server Action runs in the background
6. Navigation happens
7. \`isPending\` becomes false

## Visual Feedback

Use \`isPending\` to disable buttons, show spinners, or dim content. Users see immediate feedback while the operation completes.`,
        description: 'Keep your UI responsive during expensive operations with useTransition.',
        published: true,
        slug: 'usetransition',
        title: 'useTransition',
      },
      {
        content: `# Skeleton Loading

Skeletons are placeholder UI that mimics content shape. They reduce perceived loading time by showing page structure immediately.

## Creating Skeletons

A skeleton is a div with pulsing animation:

\`\`\`tsx
function Skeleton({ className }) {
  return <div className={\`animate-pulse rounded-md bg-muted \${className}\`} />;
}
\`\`\`

## Match Content Layout

Skeletons should match the final content shape:

\`\`\`tsx
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
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
\`\`\`

## Export with Components

Keep skeletons in sync by exporting them together:

\`\`\`tsx
export async function PostList({ searchParams }) {
  const posts = await getPosts(filter);
  return posts.map(post => <PostCard post={post} />);
}

export function PostListSkeleton() {
  // ...
}
\`\`\`

When you change the component, the skeleton is right there to update.

## Using with Suspense

\`\`\`tsx
<Suspense fallback={<PostListSkeleton />}>
  <PostList searchParams={searchParams} />
</Suspense>
\`\`\`

Users see the skeleton immediately while data loads.`,
        description: 'Build skeleton loaders that match your content layout.',
        published: true,
        slug: 'skeleton-loading',
        title: 'Skeleton Loading',
      },
      {
        content: `# Authorization Patterns

Next.js provides the \`unauthorized()\` function for handling authorization in Server Components. Combined with \`unauthorized.tsx\`, you can declaratively handle access control.

## Enabling authInterrupts

Enable in your config:

\`\`\`tsx
const config = {
  experimental: {
    authInterrupts: true,
  },
};
\`\`\`

## Checking Authorization

In pages, check permissions and call \`unauthorized()\`:

\`\`\`tsx
import { unauthorized } from 'next/navigation';

export default function DashboardPage({ searchParams }: Props) {
  if (!canManagePosts()) {
    unauthorized();
  }

  return <Dashboard />;
}
\`\`\`

This stops rendering and shows the unauthorized page.

## The unauthorized.tsx File

Customize what denied users see:

\`\`\`tsx
export default function Unauthorized() {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Access Denied</CardTitle>
        <CardDescription>You don't have permission to view this page.</CardDescription>
      </CardHeader>
    </Card>
  );
}
\`\`\`

## Protecting Server Actions

Always check authorization in actions too—page checks aren't enough:

\`\`\`tsx
export async function deletePost(slug: string) {
  if (!canManagePosts()) {
    throw new Error('Unauthorized');
  }
  await prisma.post.delete({ where: { slug } });
}
\`\`\`

## Conditional UI

For softer restrictions, conditionally render elements:

\`\`\`tsx
{canManagePosts() && <Link href="/dashboard">Dashboard</Link>}
\`\`\`

Unauthorized users simply don't see the link.`,
        description: 'Handle authorization with unauthorized() and unauthorized.tsx.',
        published: true,
        slug: 'authorization',
        title: 'Authorization Patterns',
      },
      {
        content: `# Static vs Dynamic Rendering

With \`cacheComponents: true\`, Next.js defaults to dynamic rendering. You opt into static rendering with \`"use cache"\`. Understanding this distinction explains why some pages need loading states and others don't.

## Static Pages

Static pages render once and serve the same result to subsequent users. They can be generated at build time OR on-demand when the first user visits—either way, the result is cached and served statically.

The blog's home page is static:

\`\`\`tsx
export default function HomePage() {
  return (
    <div>
      <h1>Blog</h1>
      <BlogList />
    </div>
  );
}

async function BlogList() {
  const posts = await getPublishedPosts(); // Uses "use cache"
  return posts.map(post => <PostCard post={post} />);
}
\`\`\`

Because \`getPublishedPosts\` uses \`"use cache"\`, the result is cached. The first user generates the static content, subsequent users get it instantly—no loading states needed.

## Dynamic Pages

Dynamic pages render fresh on each request. They're needed when content depends on request-time data like \`searchParams\`, \`cookies()\`, or \`headers()\`.

The dashboard is dynamic:

\`\`\`tsx
export default function DashboardPage({ searchParams }: Props) {
  return (
    <div>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
\`\`\`

The \`searchParams\` prop triggers dynamic rendering—\`?filter=drafts\` shows different content than \`?filter=published\`. Each request fetches fresh data, so Suspense fallbacks show while loading.

## What Makes a Page Dynamic?

These trigger dynamic rendering:
- Reading \`searchParams\` or \`params\`
- Calling \`cookies()\` or \`headers()\`
- Data fetches without \`"use cache"\`

## Invalidating Static Content

Static content stays cached until invalidated:

\`\`\`tsx
export async function createPost(formData: FormData) {
  await prisma.post.create({ data });
  updateTag('posts'); // Invalidate the cache
}
\`\`\`

After \`updateTag('posts')\`, the next request regenerates the static content.

## Why It Matters

- **Static pages**: Load instantly for most users. First user may wait while content generates.
- **Dynamic pages**: Every user waits for fresh data. Use Suspense to keep the UI responsive.

The blog homepage has no loading states because static content is ready. The dashboard shows skeletons everywhere—the post list, individual post pages, and edit forms—because it fetches fresh data per-request.`,
        description: 'Understand when pages are static vs dynamic and why loading states differ.',
        published: true,
        slug: 'static-vs-dynamic',
        title: 'Static vs Dynamic Rendering',
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
