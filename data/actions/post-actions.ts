'use server';

import { updateTag } from 'next/cache';

import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'on';

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  await slow();
  await prisma.post.create({
    data: { content, published, title },
  });

  updateTag('posts');
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'on';

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  await slow();
  await prisma.post.update({
    data: { content, published, title },
    where: { id },
  });

  updateTag('posts');
}

export async function deletePost(id: string) {
  await slow();
  await prisma.post.delete({
    where: { id },
  });

  updateTag('posts');
}
