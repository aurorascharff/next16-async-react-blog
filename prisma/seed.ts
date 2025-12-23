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
        content: `# React Server Components in Next.js

In Next.js App Router, all components are **Server Components by default**. This means they render on the server and send HTML to the client with zero JavaScript.

## When to Use Server Components

Server Components are ideal for:

- Fetching data directly in the component
- Accessing backend resources (databases, file system)
- Keeping sensitive information on the server (API keys, tokens)

## Example: Fetching Data

\`\`\`tsx
// This runs on the server - no "use client" directive
async function BlogPost({ slug }: { slug: string }) {
  const post = await prisma.post.findUnique({ 
    where: { slug } 
  });
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

## When to Use Client Components

Add \`'use client'\` at the top of a file when you need:

- **Interactivity** - onClick, onChange, useState, useEffect
- **Browser APIs** - localStorage, window, navigator
- **Custom hooks** that depend on state or effects

\`\`\`tsx
'use client';

import { useState } from 'react';

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(l => l + 1)}>{likes}</button>;
}
\`\`\`

Server Components can import and render Client Components, but not vice versa.`,
        description: 'Understand when to use Server Components vs Client Components in Next.js App Router.',
        published: true,
        slug: 'getting-started-with-react-server-components',
        title: 'React Server Components in Next.js',
      },
      {
        content: `# Suspense and Streaming in Next.js

Suspense lets you declaratively specify loading UI while async content loads. In Next.js, this enables **streaming** - sending HTML in chunks as it becomes ready.

## Basic Suspense Usage

\`\`\`tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <Suspense fallback={<p>Loading posts...</p>}>
        <PostList />
      </Suspense>
    </div>
  );
}

async function PostList() {
  const posts = await getPosts(); // This can take time
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
\`\`\`

## How Streaming Works

1. Server sends the shell (layout, static content) immediately
2. Suspense boundaries show their fallback
3. As each async component resolves, its HTML streams to the client
4. React hydrates each chunk as it arrives

## loading.tsx Convention

Next.js automatically wraps \`page.tsx\` in Suspense when you create \`loading.tsx\`:

\`\`\`tsx
// app/posts/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
\`\`\`

This is equivalent to wrapping your page in \`<Suspense fallback={<Loading />}>\`.

## Nested Suspense

You can nest Suspense boundaries for granular loading states:

\`\`\`tsx
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
</Suspense>
<Suspense fallback={<ContentSkeleton />}>
  <Content />
</Suspense>
\`\`\`

Each section loads independently and streams as soon as it's ready.`,
        description: 'Learn how Suspense enables streaming HTML and progressive loading in Next.js.',
        published: true,
        slug: 'understanding-suspense-boundaries',
        title: 'Suspense and Streaming in Next.js',
      },
      {
        content: `# Skeleton Loading Patterns

Skeletons are placeholder UI that mimics the shape of content before it loads. They reduce perceived loading time by showing users the page structure immediately.

## Creating a Skeleton Component

\`\`\`tsx
// components/ui/skeleton.tsx
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}
\`\`\`

## Usage with Suspense

\`\`\`tsx
function PostCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PostCardSkeleton />}>
      <PostCard />
    </Suspense>
  );
}
\`\`\`

## Best Practices

1. **Match the layout** - Skeleton shape should match the final content
2. **Use consistent animation** - \`animate-pulse\` is the standard
3. **Avoid layout shift** - Use fixed dimensions that match final content
4. **Keep it simple** - Don't over-detail skeletons

## loading.tsx for Route Segments

\`\`\`tsx
// app/posts/[slug]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function PostLoading() {
  return (
    <article className="space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-64 w-full" />
    </article>
  );
}
\`\`\`

This automatically shows while the page loads.`,
        description: 'Implement skeleton loaders with Suspense for better perceived performance.',
        published: true,
        slug: 'skeleton-loading-patterns',
        title: 'Skeleton Loading Patterns',
      },
      {
        content: `# Error Handling in Next.js

Next.js provides file conventions for handling errors at different levels of your application.

## error.tsx - Route Error Boundary

Create \`error.tsx\` to catch errors in a route segment and its children:

\`\`\`tsx
'use client'; // Error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
\`\`\`

The \`reset\` function attempts to re-render the error boundary's contents.

## global-error.tsx - Root Error Boundary

For errors in the root layout, create \`app/global-error.tsx\`:

\`\`\`tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
\`\`\`

## not-found.tsx - 404 Handling

Handle missing resources with \`not-found.tsx\`:

\`\`\`tsx
// app/posts/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>Could not find the requested post.</p>
      <Link href="/posts">Back to posts</Link>
    </div>
  );
}
\`\`\`

Trigger it with:

\`\`\`tsx
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();
  return post;
}
\`\`\`

## Error Hierarchy

Errors bubble up to the nearest error boundary. Create error.tsx at different levels for granular handling.`,
        description: 'Handle errors gracefully using Next.js error.tsx, global-error.tsx, and not-found.tsx.',
        published: true,
        slug: 'error-handling-with-error-boundaries',
        title: 'Error Handling in Next.js',
      },
      {
        content: `# Server Actions and Forms

Server Actions are async functions that run on the server. They're the recommended way to handle form submissions and data mutations in Next.js.

## Defining a Server Action

\`\`\`tsx
// data/actions/post-actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  await prisma.post.create({
    data: { title, content },
  });
  
  revalidatePath('/posts');
}
\`\`\`

## Using with Forms

\`\`\`tsx
import { createPost } from '@/data/actions/post-actions';

export default function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
\`\`\`

## useActionState for Form State

\`\`\`tsx
'use client';

import { useActionState } from 'react';

export function PostForm({ action }) {
  const [state, formAction] = useActionState(action, initialState);
  
  return (
    <form action={formAction}>
      {state.error && <p className="text-red-500">{state.error}</p>}
      <input name="title" defaultValue={state.title} />
      <button type="submit">Save</button>
    </form>
  );
}
\`\`\`

## Pending States with useFormStatus

\`\`\`tsx
'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
\`\`\`

Server Actions automatically integrate with Next.js caching and revalidation.`,
        description: 'Learn how to use Server Actions for form handling and data mutations in Next.js.',
        published: false,
        slug: 'draft-upcoming-features',
        title: 'Server Actions and Forms',
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
