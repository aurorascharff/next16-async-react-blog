/* eslint-disable no-console */
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:dev.db',
});

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
        content:
          'React Server Components allow you to render components on the server, reducing the JavaScript bundle sent to the client and improving performance.',
        published: true,
        slug: 'getting-started-with-react-server-components',
        title: 'Getting Started with React Server Components',
      },
      {
        content:
          'Suspense boundaries let you show fallback content while waiting for async operations. Combined with React 19, you can stream content progressively.',
        published: true,
        slug: 'understanding-suspense-boundaries',
        title: 'Understanding Suspense Boundaries',
      },
      {
        content:
          'Skeleton loaders provide visual feedback during data fetching. They reduce perceived loading time and improve user experience significantly.',
        published: true,
        slug: 'skeleton-loading-patterns',
        title: 'Skeleton Loading Patterns',
      },
      {
        content:
          'Error boundaries catch JavaScript errors in component trees. In Next.js, you can use error.tsx files to handle errors declaratively.',
        published: true,
        slug: 'error-handling-with-error-boundaries',
        title: 'Error Handling with Error Boundaries',
      },
      {
        content:
          'This is a draft post that is not yet published. Only visible to authors. This demonstrates the draft functionality in our CRUD app.',
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
