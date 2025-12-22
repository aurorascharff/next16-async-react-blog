import 'server-only';

import { cache } from 'react';

import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export const getPosts = cache(async (filter?: 'all' | 'published' | 'drafts') => {
  await slow();
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    where: filter === 'published' ? { published: true } : filter === 'drafts' ? { published: false } : undefined,
  });
});

export const getPostById = cache(async (id: string) => {
  await slow();
  return await prisma.post.findUnique({
    where: { id },
  });
});
