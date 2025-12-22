import 'server-only';

import { cache } from 'react';

import { notFound } from 'next/navigation';

import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export const getPosts = cache(async (filter?: 'all' | 'published' | 'drafts') => {
  await slow();
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    where: filter === 'published' ? { published: true } : filter === 'drafts' ? { published: false } : undefined,
  });
});

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
