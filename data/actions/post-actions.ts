'use server';

import { updateTag } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'on';

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  // Ensure unique slug
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  await slow();
  await prisma.post.create({
    data: { content, published, slug, title },
  });

  updateTag('posts');
}

export async function updatePost(slug: string, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'on';

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  await slow();
  await prisma.post.update({
    data: { content, published, title },
    where: { slug },
  });

  updateTag('posts');
}

export async function deletePost(slug: string) {
  await slow();
  await prisma.post.delete({
    where: { slug },
  });

  updateTag('posts');
}

export async function toggleArchivePost(slug: string, archived: boolean) {
  await slow();
  await prisma.post.update({
    data: { archived },
    where: { slug },
  });

  updateTag('posts');
}
