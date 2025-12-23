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
        content: `# Getting Started with React Server Components

React Server Components allow you to render components on the server, reducing the JavaScript bundle sent to the client and improving performance.

## Why Server Components?

- **Reduced bundle size** - Server components don't add to your JavaScript bundle
- **Direct database access** - Query your database without an API layer
- **Automatic code splitting** - Only ship the JavaScript you need

## Example

\`\`\`tsx
async function BlogPost({ id }) {
  const post = await db.post.findUnique({ where: { id } });
  return <article>{post.content}</article>;
}
\`\`\`

Server Components are the future of React development.`,
        description: 'Learn how React Server Components can improve your app performance by rendering on the server.',
        published: true,
        slug: 'getting-started-with-react-server-components',
        title: 'Getting Started with React Server Components',
      },
      {
        content: `# Understanding Suspense Boundaries

Suspense boundaries let you show fallback content while waiting for async operations. Combined with React 19, you can stream content progressively.

## How Suspense Works

Wrap your async components in a \`<Suspense>\` boundary:

\`\`\`tsx
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
\`\`\`

## Benefits

- **Progressive loading** - Show content as it becomes available
- **Better UX** - Users see something immediately
- **Streaming** - Server can stream HTML chunks`,
        description: 'Master Suspense boundaries to create smooth loading experiences with progressive streaming.',
        published: true,
        slug: 'understanding-suspense-boundaries',
        title: 'Understanding Suspense Boundaries',
      },
      {
        content: `# Skeleton Loading Patterns

Skeleton loaders provide visual feedback during data fetching. They reduce perceived loading time and improve user experience significantly.

## Implementation

\`\`\`tsx
function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
    </div>
  );
}
\`\`\`

## Best Practices

- Match the skeleton shape to your content
- Use subtle animations
- Keep skeletons simple`,
        description: 'Implement skeleton loaders to reduce perceived loading time and enhance user experience.',
        published: true,
        slug: 'skeleton-loading-patterns',
        title: 'Skeleton Loading Patterns',
      },
      {
        content: `# Error Handling with Error Boundaries

Error boundaries catch JavaScript errors in component trees. In Next.js, you can use error.tsx files to handle errors declaratively.

## Creating an Error Boundary

\`\`\`tsx
// app/posts/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

## Key Points

- Error boundaries must be client components
- Use \`reset\` to retry the failed operation
- Errors bubble up to the nearest boundary`,
        description: 'Handle errors gracefully using error boundaries and Next.js error.tsx conventions.',
        published: true,
        slug: 'error-handling-with-error-boundaries',
        title: 'Error Handling with Error Boundaries',
      },
      {
        content: `# Upcoming Features

This is a draft post that is not yet published. Only visible to authors.

## What's Coming

- **Dark mode** - Full dark mode support
- **Comments** - Reader comments on posts
- **Tags** - Categorize posts with tags

Stay tuned for updates!`,
        description: 'A preview of exciting new features coming soon to the platform.',
        published: false,
        slug: 'draft-upcoming-features',
        title: 'Draft: Upcoming Features',
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
