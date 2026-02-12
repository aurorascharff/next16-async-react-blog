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
        createdAt: new Date('2025-11-06T10:00:00Z'),
        description: 'Why in-between states matter and how to solve the coordination problem.',
        published: true,
        seed: true,
        slug: 'in-between-states',
        title: 'The In-Between States',
      },
      {
        content: `# When to Use Client Components

Server Components fetch data. Client Components handle interactions. This split determines where in-between states live and how they're managed.

**Server Components** determine *what* loads—they're async, fetch data directly, and render on the server. **Client Components** handle *how users interact*—optimistic updates, pending indicators, form state, and event handlers.

## Server Components: Data Fetching

Server Components can be async and fetch data directly. No loading state management—Suspense handles that:

\`\`\`tsx
async function BlogList() {
  const posts = await getPublishedPosts();
  return posts.map(post => <Card key={post.slug}>{post.title}</Card>);
}
\`\`\`

This component has no \`'use client'\`—it runs on the server, has direct database access, and streams HTML to the client.

## Client Components: Interactions

Add \`'use client'\` when you need React hooks, event handlers, or browser APIs:

\`\`\`tsx
'use client';

export function ArchiveButton({ slug, archived }) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived);
  const isPending = optimisticArchived !== archived;

  function archiveAction() {
    startTransition(async () => {
      setOptimisticArchived(!optimisticArchived);
      await toggleArchivePost(slug, !archived);
    });
  }

  return (
    <form data-pending={isPending || undefined} action={archiveAction}>
      <button disabled={isPending}>
        {optimisticArchived ? 'Unarchive' : 'Archive'}
      </button>
    </form>
  );
}
\`\`\`

This component uses \`useOptimistic\` for instant feedback—it must be a Client Component.

## CSS :has() for Parent Styling

Here's a powerful pattern: Server Components can style based on Client Component state using CSS \`:has()\` and data attributes.

\`\`\`tsx
// Client Component sets data-pending
<form data-pending={isPending || undefined}>...</form>

// Server Component styles based on child state
<Card className="has-data-pending:animate-pulse">
  <ArchiveButton slug={post.slug} archived={post.archived} />
</Card>
\`\`\`

Tailwind's \`has-data-pending:\` variant maps to CSS \`:has([data-pending])\`. The Card pulses during the archive action—without becoming a Client Component itself.

## The Leaf Principle

Keep Client Components at the leaves of your component tree:

\`\`\`text
ServerComponent (layout, data fetching)
├── ServerComponent (more layout)
│   └── ClientComponent (button with pending state)
└── ServerComponent (list rendering)
    └── ClientComponent (toggle with optimistic update)
\`\`\`

Server Components handle layout and data; Client Components handle interactive in-between states. This maximizes server work and minimizes client JavaScript.`,
        createdAt: new Date('2025-11-04T10:00:00Z'),
        description: 'Server vs Client Components, CSS :has() for parent styling, leaf principle.',
        published: true,
        seed: true,
        slug: 'react-server-components',
        title: 'When to Use Client Components',
      },
      {
        content: `# Streaming with Suspense

Without Suspense, users see blank screens while data loads. Each database query or API call blocks the entire page from rendering. With Suspense, you **design** what users see during loading—skeleton placeholders that communicate progress, not emptiness.

Each Suspense boundary is a UX decision: "What should users see while this section loads?" And importantly: "Should these sections wait for each other, or load independently?"

## Independent Streaming

Separate boundaries let sections stream in parallel. The tabs can appear while posts are still loading:

\`\`\`tsx
import { Suspense } from 'react';

export default function DashboardPage({ searchParams }) {
  return (
    <div>
      <Suspense fallback={<PostTabsSkeleton />}>
        <PostTabs />
      </Suspense>
      <Suspense fallback={<SortButtonSkeleton />}>
        <SortButton />
      </Suspense>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
\`\`\`

Each component fetches its own data. As each resolves, it streams in and replaces its skeleton—independently of the others.

## Boundary Placement Strategy

How you group components inside Suspense boundaries affects perceived performance:

| Scenario | Strategy | Effect |
|----------|----------|--------|
| Related content | Single boundary | Load together, show together |
| Independent sections | Separate boundaries | Stream in parallel as ready |
| Critical UI (header, nav) | Outside boundaries | Always visible immediately |
| Heavy content | Own boundary | Don't block lighter content |

## Nested Boundaries

Suspense boundaries can nest. Inner boundaries resolve first:

\`\`\`tsx
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<ContentSkeleton />}>
    <Content />
  </Suspense>
</Suspense>
\`\`\`

The outer skeleton shows briefly, then the header appears, then content streams in. Users see progressive disclosure.

## Transitions Keep Content Visible

Here's a crucial distinction: Suspense fallbacks appear on **initial load**. During subsequent navigations wrapped in \`startTransition\`, React keeps existing content visible instead of showing fallbacks again.

\`\`\`tsx
// Using Link or router.push - content stays visible during navigation
<Link href="/dashboard?filter=drafts">Drafts</Link>

// The PostList re-fetches but old content shows until new data arrives
\`\`\`

This is why filtering and sorting feel instant even though data is refetching—the skeleton only shows on first load. For subsequent interactions, the current list stays visible with a subtle pending state.`,
        createdAt: new Date('2025-11-02T10:00:00Z'),
        description: 'Independent streaming, boundary placement strategy, transitions preserve content.',
        published: true,
        seed: true,
        slug: 'suspense-and-streaming',
        title: 'Streaming with Suspense',
      },
      {
        content: `# Server Functions

Form submissions are classic in-between state challenges. The user clicks submit, data travels to the server, validation runs, the database updates, and finally the UI reflects the change. Without proper coordination, users see frozen buttons, lose their input on errors, or wonder if anything happened at all.

Server Functions (\`"use server"\`) handle the entire mutation lifecycle: validation, database writes, cache invalidation, and error recovery. They run on the server but can be called directly from client components—no API routes needed.

## The Full Pattern

A well-structured Server Function handles validation, persistence, cache invalidation, and returns typed results:

\`\`\`tsx
'use server';

import { refresh, revalidateTag } from 'next/cache';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean(),
});

export type ActionResult =
  | { success: true }
  | { success: false; error: string; formData?: FormValues };

export async function createPost(formData: FormData): Promise<ActionResult> {
  const rawData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    published: formData.get('published') === 'on',
  };

  const result = postSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message, formData: rawData };
  }

  await prisma.post.create({ data: result.data });
  revalidateTag('posts', 'max');
  refresh();
  return { success: true };
}
\`\`\`

## Preserving Input on Errors

The key insight is returning submitted data when validation fails. This lets forms repopulate—users don't lose their work:

\`\`\`tsx
type ActionResult =
  | { success: true }
  | { success: false; error: string; formData?: FormValues };
\`\`\`

When used with \`useActionState\`, the form automatically repopulates with the returned \`formData\`.

## Cache Invalidation Strategy

After mutations, two things need to happen: background cache invalidation and immediate UI update.

\`\`\`tsx
revalidateTag('posts', 'max'); // Mark cache stale, revalidate in background
refresh();                      // Force immediate re-render for current user
\`\`\`

The \`'max'\` profile tells Next.js to serve stale content while revalidating in the background. Combined with \`refresh()\`, the current user sees the update immediately while other users get fresh data on their next request.

## Granular Invalidation

For updates and deletes, invalidate both the list and the specific item:

\`\`\`tsx
revalidateTag('posts', 'max');
revalidateTag(\`post-\${slug}\`, 'max');
refresh();
\`\`\`

This ensures the post list updates and any cached detail pages for that specific post are also refreshed.`,
        createdAt: new Date('2025-10-31T10:00:00Z'),
        description: 'Server Functions with Zod validation, typed results, granular cache invalidation.',
        published: true,
        seed: true,
        slug: 'server-functions',
        title: 'Server Functions',
      },
      {
        content: `# useActionState

Form submissions need to handle both the happy path and errors gracefully. When validation fails, losing all user input is one of the worst UX patterns—especially for long forms with rich content. \`useActionState\` solves this by preserving form state across submissions.

The hook connects a Server Function to form state, maintaining values between renders. When an action returns error data, the form repopulates automatically. When it succeeds, you can redirect or reset.

## The Core Pattern

\`\`\`tsx
'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

export function PostForm({ action, defaultValues, redirectTo }) {
  const router = useRouter();

  const [state, formAction] = useActionState(async (_prev, formData) => {
    const result = await action(formData);
    if (result.success) {
      router.push(redirectTo);
      return _prev; // Keep previous state during redirect
    }
    // Return form data to repopulate inputs
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

The state flows: user submits → action runs → on error, state updates with returned data → inputs repopulate via \`defaultValue\`.

## Why defaultValue, Not value

Using \`defaultValue\` instead of \`value\` is intentional. With \`value\`, you'd need \`onChange\` handlers and controlled components. With \`defaultValue\`, React handles the form natively—inputs are uncontrolled but repopulate when \`state\` changes.

## Reusing for Create and Edit

The same form component works for both creating and editing:

\`\`\`tsx
// Create - empty defaults, createPost action
<PostForm
  action={createPost}
  defaultValues={{ title: '', content: '', published: false }}
  redirectTo="/dashboard"
/>

// Edit - pre-filled with existing data, updatePost bound to slug
<PostForm
  action={updatePost.bind(null, slug)}
  defaultValues={existingPost}
  redirectTo={\`/dashboard/\${slug}\`}
/>
\`\`\`

The \`.bind(null, slug)\` pattern passes the slug as a curried first argument—the form data becomes the second argument.

## Error Display

Show validation errors contextually:

\`\`\`tsx
const [state, formAction] = useActionState(...);
const [error, setError] = useState<string | null>(null);

// In the wrapper function:
if (!result.success) {
  setError(result.error);
  return result.formData ?? _prev;
}
\`\`\`

Place error messages near the relevant field or at the form level—wherever makes sense for your UI.`,
        createdAt: new Date('2025-10-29T10:00:00Z'),
        description: 'Form state preservation with useActionState, defaultValue pattern, create/edit reuse.',
        published: true,
        seed: true,
        slug: 'useactionstate',
        title: 'useActionState for Forms',
      },
      {
        content: `# useFormStatus

When a form is submitting, users need feedback exactly where they initiated the action. A global loading bar doesn't tell them which button is working. \`useFormStatus\` provides the pending state of the nearest parent form—enabling localized, contextual feedback.

The hook returns \`{ pending, data, method, action }\`, but \`pending\` is what you'll use most. It becomes true when the form submits and false when the action completes.

## The SubmitButton Pattern

The most common use is a reusable submit button that shows its own loading state:

\`\`\`tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : children}
    </Button>
  );
}
\`\`\`

Drop this into any form—no prop drilling, no context providers, no state management:

\`\`\`tsx
<form action={createPost}>
  <Input name="title" />
  <SubmitButton>Create Post</SubmitButton>
</form>
\`\`\`

The button automatically shows a spinner during submission and disables to prevent double-clicks.

## The Child Component Constraint

Here's the critical detail: \`useFormStatus\` must be called from a **child component** of the form. It doesn't work in the same component that renders the form:

\`\`\`tsx
// ❌ Won't work - same component as form
function BadForm() {
  const { pending } = useFormStatus(); // Always false
  return <form action={action}>...</form>;
}

// ✅ Works - SubmitButton is a separate child component
function GoodForm() {
  return (
    <form action={action}>
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}
\`\`\`

This constraint exists because React needs to track which form the status belongs to—and that relationship is established through the component tree.

## Beyond Buttons

Use the pattern for any form feedback:

\`\`\`tsx
function FormProgress() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return <Progress value={undefined} className="w-full" />;
}
\`\`\`

The principle: button click → button feedback. Keep pending indicators close to where users took action.`,
        createdAt: new Date('2025-10-27T10:00:00Z'),
        description: 'SubmitButton pattern, child component constraint, localized form feedback.',
        published: true,
        seed: true,
        slug: 'useformstatus',
        title: 'useFormStatus',
      },
      {
        content: `# useOptimistic

The best in-between state is **no perceived delay at all**. When a user toggles a setting, bookmarks an item, or archives a post, the UI should update instantly—even while the server action runs in the background.

\`useOptimistic\` creates a local state that updates immediately, then syncs with the actual server state when the action completes. If the action fails, React automatically reverts to the true state.

## The Archive Button Pattern

Here's a real example from this app—an archive toggle that feels instant:

\`\`\`tsx
'use client';

import { useOptimistic, startTransition } from 'react';

export function ArchiveButton({ slug, archived }) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived);
  const isPending = optimisticArchived !== archived;

  function archiveAction() {
    startTransition(async () => {
      setOptimisticArchived(!optimisticArchived);
      await toggleArchivePost(slug, !archived);
    });
  }

  return (
    <form data-pending={isPending || undefined} action={archiveAction}>
      <button type="submit" disabled={isPending}>
        {optimisticArchived ? 'Unarchive' : 'Archive'}
      </button>
    </form>
  );
}
\`\`\`

Click archive → icon switches instantly → server updates in background → states sync.

## Deriving Pending State

Notice there's no separate \`isPending\` from \`useTransition\`. Instead, we derive it:

\`\`\`tsx
const isPending = optimisticArchived !== archived;
\`\`\`

While the action runs, the optimistic value differs from the prop. When the action completes and the parent re-renders with new data, they match again and \`isPending\` becomes false. This is elegant—the pending state emerges from the data itself.

## Parent Styling with data-pending

The \`data-pending\` attribute enables something powerful: Server Components can style based on Client Component state.

\`\`\`tsx
// In the Client Component
<form data-pending={isPending || undefined}>

// In the Server Component (PostList)
<Card className="has-data-pending:animate-pulse has-data-pending:bg-muted/70">
  <ArchiveButton slug={post.slug} archived={post.archived} />
</Card>
\`\`\`

Tailwind's \`has-data-pending:\` variant uses CSS \`:has([data-pending])\`—the Card pulses during the action without becoming a Client Component itself.

## When to Use Optimistic Updates

Best for high success rate, reversible actions:
- Toggles (archive, bookmark, like)
- Status changes
- Settings updates

Avoid for actions that need validation feedback or have meaningful failure modes—use \`useTransition\` instead so you can handle errors before updating UI.`,
        createdAt: new Date('2025-10-25T10:00:00Z'),
        description: 'Instant feedback with useOptimistic, derived pending state, data-pending for parent styling.',
        published: true,
        seed: true,
        slug: 'useoptimistic',
        title: 'useOptimistic for Instant Feedback',
      },
      {
        content: `# The "use cache" Directive

Caching eliminates in-between states entirely—if content is pre-rendered, there's nothing to wait for. Next.js 16 introduces the \`"use cache"\` directive for fine-grained, explicit caching control.

With \`cacheComponents: true\` in your Next.js config, **data fetching is dynamic by default**. This is the opposite of the previous implicit caching behavior. You now opt into caching explicitly with \`"use cache"\`.

## The Development Flow

The recommended approach for this project:

- **Fetching data** — Create queries in \`data/queries/\`, call in Server Components. Use React's \`cache()\` for request deduplication.
- **Mutating data** — Create Server Functions in \`data/actions/\` with \`"use server"\`. Invalidate with \`revalidateTag(tag, 'max')\` + \`refresh()\`.
- **Caching** — Add \`"use cache"\` to functions, components, or pages you want to cache across requests.

## Basic Usage

Add the directive at the top of a function, then tag the cache for invalidation:

\`\`\`tsx
import { cacheTag } from 'next/cache';
import { cache } from 'react';

export const getPublishedPosts = cache(async () => {
  'use cache';
  cacheTag('posts');

  return await prisma.post.findMany({
    where: { published: true, archived: false },
    orderBy: { createdAt: 'desc' },
  });
});
\`\`\`

The \`cache()\` wrapper from React deduplicates calls within a single render. The \`"use cache"\` directive caches the result across requests. Together, they eliminate both redundant queries within a request and redundant work across requests.

## Cache Invalidation

After mutations, you need to invalidate the cache and update the current user's view:

\`\`\`tsx
import { refresh, revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  'use server';
  
  await prisma.post.create({ data });
  
  revalidateTag('posts', 'max'); // Mark stale, revalidate in background
  refresh();                      // Force immediate re-render
}
\`\`\`

| Function | Purpose |
|----------|---------|
| \`revalidateTag(tag, 'max')\` | Marks cache stale, triggers background revalidation |
| \`updateTag(tag)\` | Marks cache stale, revalidates immediately (blocking) |
| \`refresh()\` | Forces immediate client re-render with fresh data |

The \`'max'\` profile serves stale content while revalidating—other users get fast responses while fresh data generates. Use \`updateTag\` when you need the mutation to block until fresh data is ready.

## Granular Cache Tags

Tag individual items for precise invalidation:

\`\`\`tsx
export const getPublishedPostBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(\`post-\${slug}\`);

  return await prisma.post.findUnique({
    where: { slug, published: true },
  });
});
\`\`\`

When updating a post:

\`\`\`tsx
revalidateTag('posts', 'max');        // Invalidate the list
revalidateTag(\`post-\${slug}\`, 'max'); // Invalidate this specific post
refresh();
\`\`\`

This ensures both the post list and the individual post's detail page update.

## Push Dynamic Data Deep

To maximize cacheable content, push dynamic data access as deep as possible in the component tree. Components that read \`searchParams\`, \`cookies()\`, or \`headers()\` become dynamic—wrap them in \`<Suspense>\` so static parent content can render immediately.`,
        createdAt: new Date('2025-10-23T10:00:00Z'),
        description: '"use cache" with cacheTag, revalidateTag + refresh() for invalidation, granular tags.',
        published: true,
        seed: true,
        slug: 'use-cache-directive',
        title: 'Caching with use cache',
      },
      {
        content: `# View Transitions

Route changes are a unique in-between state. Without visual continuity, content disappears then reappears abruptly—users lose spatial context. Where did that card go? Am I on a new page or the same page?

React's \`<ViewTransition>\` component wraps the browser's View Transitions API, enabling smooth animated transitions between routes with a declarative API.

## Page-Level Transitions

Wrap page content in \`<ViewTransition>\` with enter/exit animations:

\`\`\`tsx
import { ViewTransition } from 'react';

export function SlideRightTransition({ children }) {
  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right" default="none">
      {children}
    </ViewTransition>
  );
}

// In your page
export default function DashboardPage() {
  return (
    <SlideRightTransition>
      <div>...</div>
    </SlideRightTransition>
  );
}
\`\`\`

Define the animations in CSS with \`@keyframes\`.

## Shared Element Transitions

Connect elements across pages with the same \`name\` prop. When navigating, the element morphs from its position on one page to its position on the next:

\`\`\`tsx
// In the list view (Dashboard)
<ViewTransition name={\`post-card-\${post.slug}\`} share="morph">
  <Card>{post.title}</Card>
</ViewTransition>

// In the detail view (Post page)
<ViewTransition name={\`post-card-\${slug}\`} share="morph">
  <Card>{post.title}</Card>
</ViewTransition>
\`\`\`

The card animates smoothly from the list to its position on the detail page. Users see visual continuity—the same element moving, not disappearing and reappearing.

## Directional Navigation

Create a sense of spatial hierarchy with directional transitions:

\`\`\`tsx
// Going "into" a detail page - slide from right
<SlideRightTransition>
  <PostDetail />
</SlideRightTransition>

// Going "back" to a list - slide from left
<SlideLeftTransition>
  <PostList />
</SlideLeftTransition>
\`\`\`

Forward navigation slides right; back navigation slides left. Users build a mental model of your app's structure.

## Browser Support

View Transitions use the native View Transitions API. In unsupported browsers, navigation works normally without animation—progressive enhancement by default.`,
        createdAt: new Date('2025-10-21T10:00:00Z'),
        description: 'Page-level transitions, shared element morphing, directional navigation.',
        published: true,
        seed: true,
        slug: 'view-transitions',
        title: 'View Transitions API',
      },
      {
        content: `# Error Handling

Errors are in-between states we hope users never see—but they will. Network failures, database timeouts, validation errors, and unexpected exceptions are inevitable. The question isn't whether errors will occur, but whether users can recover from them gracefully.

Design components should own error presentation and recovery paths, making route files thin wrappers that compose these building blocks.

## ErrorCard for Page-Level Errors

Create a reusable error display component:

\`\`\`tsx
export function ErrorCard({ error, reset, title = 'Something went wrong' }) {
  return (
    <Card>
      <CardHeader>
        <AlertCircle className="text-destructive size-12" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {reset && <Button onClick={reset}>Try again</Button>}
      </CardContent>
    </Card>
  );
}
}
\`\`\`

## error.tsx Uses ErrorCard

The \`error.tsx\` route file becomes a thin wrapper:

\`\`\`tsx
'use client';

import { ErrorCard } from '@/components/design/ErrorCard';
import { useTrackError } from '@/hooks/useTrackError';

export default function PostError({ error, reset }) {
  useTrackError(error); // Log to error tracking service

  return (
    <ErrorCard
      error={error}
      reset={reset}
      title="Failed to load post"
      description="We couldn't load this post. Please try again."
    />
  );
}
\`\`\`

The \`reset\` function re-renders the error boundary's children, giving the operation another chance.

## ErrorBoundary for Inline Errors

For errors within a page (not full-page), use an error boundary component:

\`\`\`tsx
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorCard } from './ErrorCard';

export function ErrorBoundary({ children, label }) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorCard
          error={error}
          reset={resetErrorBoundary}
          title={label || 'Something went wrong'}
        />
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// Usage
<ErrorBoundary label="Failed to load posts">
  <PostList searchParams={searchParams} />
</ErrorBoundary>
\`\`\`

## StatusCard for Expected States

For states like 404 that aren't really "errors," use a neutral status card:

\`\`\`tsx
// not-found.tsx
import { FileQuestion } from 'lucide-react';
import { StatusCard } from '@/components/design/StatusCard';
import { BackButton } from '@/components/BackButton';

export default function NotFound() {
  return (
    <StatusCard
      icon={FileQuestion}
      title="Post Not Found"
      description="This post doesn't exist or has been removed."
    >
      <BackButton href="/dashboard">Back to posts</BackButton>
    </StatusCard>
  );
}
\`\`\`

The pattern: design components own visuals and recovery UX; route files compose them with minimal logic.

## Toasts for Action Feedback

Not all errors need a full error boundary. For Server Function results—form submissions, deletions, toggles—use toasts (Sonner) to give immediate feedback without disrupting the page:

\`\`\`tsx
'use client';

import { useActionState } from 'react';
import { toast } from 'sonner';

const [state, formAction] = useActionState(async (prevState, formData) => {
  const result = await action(formData);
  if (result.success) {
    toast.success('Post saved successfully');
    router.push(redirectTo);
    return prevState;
  } else {
    toast.error(result.error);
    return result.formData ?? prevState;
  }
}, defaultValues);
\`\`\`

The key insight: **error boundaries handle unexpected failures** (crashes, network errors). **Toasts handle expected outcomes** (validation errors, success confirmations). Use both together—error boundaries catch what you didn't anticipate, toasts communicate what you did.`,
        createdAt: new Date('2025-10-19T10:00:00Z'),
        description: 'ErrorCard for page errors, ErrorBoundary for inline, StatusCard for 404/expected states.',
        published: true,
        seed: true,
        slug: 'error-handling',
        title: 'Error Handling Patterns',
      },
      {
        content: `# generateStaticParams

The ultimate in-between state optimization is **eliminating it entirely**. Pre-rendered pages load instantly because there's nothing to wait for—the HTML is ready before the user even clicks.

\`generateStaticParams\` tells Next.js which dynamic route segments to pre-render at build time.

## Basic Usage

Return an array of params objects for each page to pre-render:

\`\`\`tsx
// app/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  
  return <article>{post.content}</article>;
}
\`\`\`

At build time, Next.js generates HTML for each returned slug. When users navigate to these pages, content appears instantly.

## Dynamic Metadata

Generate SEO metadata for each page:

\`\`\`tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
    },
  };
}
\`\`\`

The \`generateMetadata\` function runs at build time for static pages, embedding the correct title and description in the HTML.

## New Content On-Demand

What about new posts created after build? Next.js handles this automatically—new slugs are generated on-demand when first requested, then cached.

To ensure pre-rendered pages update when content changes:

\`\`\`tsx
// In your Server Function after creating/updating a post
revalidateTag('posts', 'max');
revalidateTag(\`post-\${slug}\`, 'max');
refresh();
\`\`\`

The combination ensures:
1. The posts list cache invalidates
2. The specific post's cache invalidates
3. The current user sees the update immediately

## Best for Read-Heavy Content

Pre-render pages that are:
- Read frequently (blog posts, documentation, product pages)
- Updated occasionally (not real-time data)
- SEO-important (need metadata in HTML)

Pages that read \`searchParams\` or need user-specific data should remain dynamic.`,
        createdAt: new Date('2025-10-17T10:00:00Z'),
        description: 'Pre-render dynamic routes, generateMetadata for SEO, on-demand generation.',
        published: true,
        seed: true,
        slug: 'generatestaticparams',
        title: 'generateStaticParams',
      },
      {
        content: `# URL State with searchParams

URL-driven state creates clear causality: tab click → URL changes → Suspense shows skeleton → new data arrives. Users understand what's happening because the URL reflects the current view.

More importantly, URL state is **shareable and bookmarkable**. \`/dashboard?filter=drafts&sort=title\` shows exactly that view—send someone the link and they see what you see.

## Reading searchParams

In Server Components, \`searchParams\` is a promise that resolves to the current query parameters:

\`\`\`tsx
type Props = {
  searchParams: Promise<{ filter?: string; sort?: string }>;
};

export async function PostList({ searchParams }: Props) {
  const { filter, sort } = await searchParams;
  
  // Validate with Zod for type safety
  const validFilter = filterSchema.parse(filter);
  const validSort = sortSchema.parse(sort);
  
  const posts = await getPosts(validFilter, validSort);
  return <PostCards posts={posts} />;
}
\`\`\`

Use Zod schemas with \`.catch()\` to provide defaults for invalid or missing params:

\`\`\`tsx
const filterSchema = z.enum(['all', 'published', 'drafts', 'archived']).catch('all');
const sortSchema = z.enum(['newest', 'oldest', 'title']).catch('newest');
\`\`\`

## Updating URL State

In Client Components, use \`router.push\` to change the URL:

\`\`\`tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function PostTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') ?? 'all';
  const currentSort = searchParams.get('sort') ?? 'newest';

  function handleFilterChange(value: string) {
    router.push(\`/dashboard?filter=\${value}&sort=\${currentSort}\`);
  }

  return (
    <TabList
      activeTab={currentFilter}
      changeAction={handleFilterChange}
    />
  );
}
\`\`\`

## Optimistic URL Updates

Combine with \`useOptimistic\` for instant feedback:

\`\`\`tsx
const [optimisticSort, setOptimisticSort] = useOptimistic(currentSort);

function handleSortChange(nextSort: string) {
  startTransition(() => {
    setOptimisticSort(nextSort);
    router.push(\`/dashboard?filter=\${currentFilter}&sort=\${nextSort}\`);
  });
}
\`\`\`

The tab/button updates instantly; the URL changes; Suspense handles the loading state for the new data.

## Benefits Over useState

| URL State | Component State |
|-----------|-----------------|
| Shareable via link | Lost on refresh |
| Works with browser history | No back/forward |
| Survives refresh | Resets to default |
| SEO-friendly | Not indexable |

For filter, sort, pagination, and view modes—use URLs. For ephemeral UI state like modal open/close—use component state.`,
        createdAt: new Date('2025-10-15T10:00:00Z'),
        description: 'searchParams for shareable state, Zod validation, optimistic URL updates.',
        published: true,
        seed: true,
        slug: 'url-state-searchparams',
        title: 'URL State with searchParams',
      },
      {
        content: `# React cache()

Duplicate requests extend loading time unnecessarily. When multiple components need the same data—say, the page component and a metadata function both reading a post—you don't want two database queries.

React's \`cache()\` deduplicates requests within a single render pass. Multiple calls with the same arguments return the same promise.

## The Pattern

Wrap your data fetching functions with \`cache()\`:

\`\`\`tsx
import { cache } from 'react';
import { notFound } from 'next/navigation';

export const getPostBySlug = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  
  if (!post) {
    notFound();
  }
  
  return post;
});
\`\`\`

Now multiple components can call \`getPostBySlug(slug)\`—only one database query executes:

\`\`\`tsx
// Both use the same cached result
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post.title };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return <article>{post.content}</article>;
}
\`\`\`

## cache() vs "use cache"

These serve different purposes:

| Feature | \`cache()\` | \`"use cache"\` |
|---------|-----------|----------------|
| Scope | Single render pass | Across requests |
| Purpose | Deduplicate concurrent calls | Pre-render/cache results |
| Import | \`react\` | Directive |

## Combining Both

Use them together for maximum efficiency:

\`\`\`tsx
export const getPublishedPostBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(\`post-\${slug}\`);

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });
  
  if (!post) notFound();
  return post;
});
\`\`\`

- \`cache()\` ensures multiple calls within a render share the same promise
- \`"use cache"\` ensures the result is cached across requests
- \`cacheTag()\` enables targeted invalidation

## When to Use cache()

Wrap any data fetching function that might be called multiple times during a render:

- Functions called by both \`generateMetadata\` and page components
- Utility queries used across multiple Server Components
- Any async function where arguments determine the result

The function must return a promise, and React uses the arguments to determine cache keys.`,
        createdAt: new Date('2025-10-13T10:00:00Z'),
        description: 'Request deduplication with cache(), combining with "use cache" directive.',
        published: true,
        seed: true,
        slug: 'react-cache',
        title: 'cache() for Deduplication',
      },
      {
        content: `# useTransition

For destructive or high-stakes actions, users need immediate feedback that something is happening and protection from accidental double-clicks. \`useTransition\` provides a pending state that wraps the entire async operation—including any navigation that follows.

Unlike \`useOptimistic\` which updates UI immediately and hopes for success, \`useTransition\` waits for confirmation before updating. This is the right choice when you need to handle errors before showing results.

## The Delete Button Pattern

Deleting a post should be deliberate—disable the button, show progress, then navigate away:

\`\`\`tsx
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function DeletePostButton({ slug }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function deleteAction() {
    startTransition(async () => {
      const result = await deletePost(slug);
      if (result.success) {
        router.push('/dashboard');
      }
    });
  }

  return (
    <Button variant="destructive" onClick={deleteAction} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete Post'}
    </Button>
  );
}
\`\`\`

\`isPending\` becomes true immediately when \`startTransition\` is called. It stays true through the entire async operation **and** any navigation triggered inside—users can't click again until everything completes.

## When to Use useTransition vs useOptimistic

| Hook | UI Update | Best For |
|------|-----------|----------|
| \`useOptimistic\` | Instant, before action completes | Toggles, likes, reversible actions |
| \`useTransition\` | After action completes | Destructive actions, error handling needed |

## Transitions Keep Content Visible

During navigation wrapped in \`startTransition\`, React keeps the current UI visible instead of showing Suspense fallbacks. The pending state lets you show a loading indicator while preserving context.

## Nested Transitions

If you need to update state after an await inside a transition, wrap it in another transition:

\`\`\`tsx
startTransition(async () => {
  await deletePost(slug);
  startTransition(() => {
    router.push('/dashboard');
  });
});
\`\`\`

This ensures React batches both the action completion and the navigation correctly.`,
        createdAt: new Date('2025-10-11T10:00:00Z'),
        description: 'isPending for destructive actions, comparison with useOptimistic, keeping content visible.',
        published: true,
        seed: true,
        slug: 'usetransition',
        title: 'useTransition for Pending UI',
      },
      {
        content: `# Skeleton Loading

Spinners say "something is happening." **Skeletons say "this is what's coming."** They preview the content structure, reducing perceived loading time and preventing layout shift when data arrives.

A spinner offers no information about what will appear. A skeleton shows the shape of content—users mentally prepare for what's coming, and the transition from placeholder to real content feels natural rather than jarring.

## The Co-location Pattern

Export skeletons alongside their components. When you change a component's layout, the skeleton is right there to update:

\`\`\`tsx
// PostList.tsx
export async function PostList({ searchParams }) {
  const posts = await getPosts(searchParams);
  
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Card key={post.slug}>
          <CardTitle>{post.title}</CardTitle>
          <p>{post.description}</p>
        </Card>
      ))}
    </div>
  );
}

// Co-located skeleton in the same file
export function PostListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
        </Card>
      ))}
    </div>
  );
}
\`\`\`

## Match the Layout Structure

The skeleton should mirror the real component's structure exactly:
- Same spacing (\`space-y-4\`)
- Same container types (\`Card\`, \`CardHeader\`)
- Same approximate dimensions

When data loads, content replaces skeleton with zero layout shift.

## Using with Suspense

Import both the component and its skeleton:

\`\`\`tsx
import { PostList, PostListSkeleton } from './_components/PostList';

export default function DashboardPage({ searchParams }) {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostList searchParams={searchParams} />
    </Suspense>
  );
}
\`\`\`

## Skeleton Design Tips

| Element | Skeleton |
|---------|----------|
| Title | Rectangle, ~60% width |
| Date/metadata | Shorter rectangle, ~30% width |
| Description | Full width, shorter height |
| Avatar | Circle |
| Button | Rectangle with rounded corners |

Use subtle animation (\`animate-pulse\`) to indicate loading, but keep it gentle—aggressive animation is distracting.`,
        createdAt: new Date('2025-10-09T10:00:00Z'),
        description: 'Co-locate skeletons with components, match layout structure, prevent CLS.',
        published: true,
        seed: true,
        slug: 'skeleton-loading',
        title: 'Skeleton Co-location Pattern',
      },
      {
        content: `# Authorization Patterns

Authorization failures are a special in-between state. Unlike validation errors that users can fix, auth errors need clear messaging and a path back to safety. Next.js 16 introduces \`unauthorized()\` and \`forbidden()\` functions that trigger dedicated pages.

## In Server Components and Queries

Call \`unauthorized()\` to immediately render \`unauthorized.tsx\`:

\`\`\`tsx
import { unauthorized } from 'next/navigation';

export default function DashboardPage() {
  if (!canManagePosts()) {
    unauthorized();
  }
  
  return <Dashboard />;
}
\`\`\`

Or in data queries that require authorization:

\`\`\`tsx
export const getPosts = cache(async (filter, sort) => {
  if (!canManagePosts()) {
    unauthorized();
  }

  return await prisma.post.findMany({ ... });
});
\`\`\`

Both throw—\`unauthorized()\` never returns.

## The unauthorized.tsx Page

Create a dedicated page that matches your app's design:

\`\`\`tsx
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <StatusCard
      icon={LockKeyhole}
      title="Unauthorized"
      description="You don't have permission to access this page."
    >
      <Link href="/">Back to Blog</Link>
    </StatusCard>
  );
}
\`\`\`

## unauthorized() vs forbidden()

| Function | HTTP Status | Use When |
|----------|-------------|----------|
| \`unauthorized()\` | 401 | User not authenticated |
| \`forbidden()\` | 403 | User authenticated but lacks permission |

Both render their respective \`.tsx\` files and stop execution.`,
        createdAt: new Date('2025-10-07T10:00:00Z'),
        description: 'unauthorized() in Server Components and queries, StatusCard UI.',
        published: true,
        seed: true,
        slug: 'authorization',
        title: 'Authorization with unauthorized()',
      },
      {
        content: `# Static vs Dynamic Rendering

Static pages have no in-between state—content is ready when the user arrives. Dynamic pages need Suspense boundaries to show progress while data loads. Understanding what triggers each mode is essential for building fast, responsive UIs.

With \`cacheComponents: true\` in Next.js 16, **rendering is dynamic by default**. You opt into static/cached rendering explicitly with \`"use cache"\`.

## What Makes a Route Dynamic?

Any of these trigger dynamic rendering:
- Reading \`searchParams\` or \`params\`
- Calling \`cookies()\` or \`headers()\`
- Data fetches without \`"use cache"\` directive
- Using \`connection()\` to opt into dynamic rendering

## Static Example: Cached Queries

When your data fetching function uses \`"use cache"\`, the content can be pre-rendered:

\`\`\`tsx
// data/queries/post.ts
export const getPublishedPosts = cache(async () => {
  'use cache';
  cacheTag('posts');
  return await prisma.post.findMany({ where: { published: true } });
});

// app/page.tsx - No Suspense needed for cached content
export default async function HomePage() {
  const posts = await getPublishedPosts();
  return <PostList posts={posts} />;
}
\`\`\`

The posts are cached—no loading state needed because data is ready.

## Dynamic Example: URL Parameters

When your component reads \`searchParams\`, it becomes dynamic and needs Suspense:

\`\`\`tsx
export default function DashboardPage({ searchParams }) {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostList searchParams={searchParams} />
    </Suspense>
  );
}
\`\`\`

Inside \`PostList\`, the filter and sort values come from the URL—content can't be pre-rendered.

## Push Dynamic Access Deep

Maximize cacheable content by pushing dynamic data access as deep as possible:

\`\`\`tsx
// ❌ Entire page becomes dynamic
export default async function Page({ searchParams }) {
  const { filter } = await searchParams;
  const posts = await getPosts(filter);
  return <Layout><Posts posts={posts} /></Layout>;
}

// ✅ Only PostList is dynamic; Layout stays static
export default function Page({ searchParams }) {
  return (
    <Layout>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </Layout>
  );
}
\`\`\`

The Layout renders immediately. PostList streams in with its skeleton.

## Hybrid Pages

Most real pages mix static and dynamic content:

\`\`\`tsx
export default function DashboardPage({ searchParams }) {
  return (
    <>
      {/* Static - renders immediately */}
      <DashboardHeader />
      
      {/* Dynamic - needs searchParams */}
      <Suspense fallback={<PostListSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </>
  );
}
\`\`\`

Users see the header instantly while posts stream in.`,
        createdAt: new Date('2025-10-05T10:00:00Z'),
        description: 'cacheComponents default, what triggers dynamic rendering, push dynamic access deep.',
        published: true,
        seed: true,
        slug: 'static-vs-dynamic',
        title: 'Static vs Dynamic Rendering',
      },
      {
        content: `# The Action Prop Pattern

Design components should handle their own in-between states internally—optimistic updates, pending indicators, transitions—rather than pushing that complexity to every consumer. The pattern: pass the **action** to perform, let the component handle the coordination.

This creates reusable components that work consistently across your app. Parents don't need to know about transitions or optimistic state—they just pass what should happen.

## The TabList Example

A tablist that handles its own optimistic updates and transitions:

\`\`\`tsx
'use client';

import { useOptimistic, useTransition } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
  tabs: { value: string; label: string }[];
  activeTab: string;
  changeAction?: (value: string) => void | Promise<void>;
};

export function TabList({ tabs, activeTab, changeAction }: Props) {
  const [optimisticTab, setOptimisticTab] = useOptimistic(activeTab);
  const [isPending, startTransition] = useTransition();

  function handleTabChange(value: string) {
    startTransition(async () => {
      setOptimisticTab(value);
      await changeAction?.(value);
    });
  }

  return (
    <Tabs value={optimisticTab} onValueChange={handleTabChange}>
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {isPending && <Spinner />}
    </Tabs>
  );
}
\`\`\`

The component owns:
- Optimistic tab switching (instant visual feedback)
- Transition wrapping (keeps content visible during fetch)
- Pending indicator (spinner next to tabs)

## Simple Parent Code

Parents become simple—just pass the action:

\`\`\`tsx
'use client';

import { useRouter } from 'next/navigation';

export function PostTabs({ currentFilter, currentSort }) {
  const router = useRouter();

  return (
    <TabList
      tabs={[
        { value: 'all', label: 'All' },
        { value: 'published', label: 'Published' },
        { value: 'drafts', label: 'Drafts' },
      ]}
      activeTab={currentFilter}
      changeAction={value => router.push(\`/dashboard?filter=\${value}&sort=\${currentSort}\`)}
    />
  );
}
\`\`\`

The parent doesn't import \`useTransition\`, doesn't manage optimistic state, doesn't show a spinner—that's all encapsulated.

## Naming Convention

Suffix action props with "Action" to distinguish them from regular callbacks:

- \`changeAction\` — for state changes
- \`submitAction\` — for form submissions
- \`deleteAction\` — for deletions

This signals that the function may be async and will be wrapped in a transition.

## The Principle

Design components own their in-between states. Parents pass what should happen; components handle how it looks while happening.`,
        createdAt: new Date('2025-10-03T10:00:00Z'),
        description: 'Action props for reusable components, encapsulate transitions and optimistic state.',
        published: true,
        seed: true,
        slug: 'action-prop-pattern',
        title: 'The Action Prop Pattern',
      },
      {
        content: `# useLinkStatus for Link Pending State

Navigation isn't always instant. Slow networks, dynamic routes that can't be prefetched, or simply large payloads can create delay. \`useLinkStatus\` provides pending state specifically for \`<Link>\` navigations—no transition management required.

The hook returns \`{ pending }\` and must be used inside a descendant component of the \`<Link>\`.

## The Pattern

Create a child component that shows loading feedback:

\`\`\`tsx
'use client';

import Link, { useLinkStatus } from 'next/link';

function SortIndicator({ label }) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending ? <Spinner /> : <ArrowUpDown />}
      <span>{label}</span>
    </>
  );
}

export function SortButton({ href, label }) {
  return (
    <Link href={href}>
      <SortIndicator label={label} />
    </Link>
  );
}
\`\`\`

Click the link → spinner appears → navigation completes → new page renders.

## When Pending Shows

The spinner appears when navigation takes time:
- **Slow connections** — Prefetching hasn't completed before clicking
- **Dynamic routes** — Routes that read \`searchParams\` or other dynamic data can't be fully prefetched
- **Large payloads** — Even prefetched routes can take time to render

On fast connections with fully prefetched routes, the spinner won't appear—and that's ideal.

## The Child Component Constraint

Like \`useFormStatus\`, \`useLinkStatus\` must be called from a **child** of the Link:

\`\`\`tsx
// ❌ Won't work - same component as Link
function BadLink() {
  const { pending } = useLinkStatus(); // Always false
  return <Link href="/page">...</Link>;
}

// ✅ Works - SortIndicator is a child inside Link
function GoodLink() {
  return (
    <Link href="/page">
      <SortIndicator />
    </Link>
  );
}
\`\`\`

## vs useTransition + router.push

| Approach | Use When |
|----------|----------|
| \`useLinkStatus\` | Simple navigation feedback, declarative, works with \`<Link>\` |
| \`useTransition\` + \`router.push\` | Need optimistic updates, imperative control, error handling |

Choose \`useLinkStatus\` for straightforward navigation feedback. Use \`useTransition\` when you need to update state optimistically or handle the navigation outcome programmatically.`,
        createdAt: new Date('2025-10-01T10:00:00Z'),
        description: 'Link pending state with useLinkStatus, child component pattern, comparison with useTransition.',
        published: true,
        seed: true,
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
