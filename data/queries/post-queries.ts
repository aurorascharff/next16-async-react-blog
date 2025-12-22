import 'server-only';

import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export const getPosts = cache(async (filter?: 'all' | 'published' | 'drafts' | 'archived') => {
  'use cache';
  cacheTag('posts');

  await slow();

  const where =
    filter === 'archived'
      ? { archived: true }
      : filter === 'published'
        ? { archived: false, published: true }
        : filter === 'drafts'
          ? { archived: false, published: false }
          : { archived: false };

  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    where,
  });
});

export const getPostBySlug = cache(async (slug: string) => {
  'use cache';
  cacheTag('posts');

  await slow();
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  if (!post) {
    notFound();
  }
  return post;
});
