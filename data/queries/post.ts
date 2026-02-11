import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

export const getPosts = cache(
  async (filter?: 'all' | 'published' | 'drafts' | 'archived', sort?: 'newest' | 'oldest' | 'title') => {
    await slow();

    const where =
      filter === 'archived'
        ? { archived: true }
        : filter === 'published'
          ? { archived: false, published: true }
          : filter === 'drafts'
            ? { archived: false, published: false }
            : { archived: false };

    const orderBy =
      sort === 'oldest'
        ? { createdAt: 'asc' as const }
        : sort === 'title'
          ? { title: 'asc' as const }
          : { createdAt: 'desc' as const };

    return await prisma.post.findMany({
      orderBy,
      where,
    });
  },
);

export const getPostBySlug = cache(async (slug: string) => {
  await slow();
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  if (!post) {
    notFound();
  }
  return post;
});

export const getPublishedPosts = cache(async () => {
  'use cache';
  cacheTag('posts');

  await slow();
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    where: { archived: false, published: true },
  });
});

export const getPublishedPostBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag(`post-${slug}`);

  await slow();
  const post = await prisma.post.findUnique({
    where: { archived: false, published: true, slug },
  });
  if (!post) {
    notFound();
  }
  return post;
});
