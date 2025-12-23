'use server';

import { updateTag } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

const postSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  description: z.string().min(1, 'Description is required'),
  published: z.boolean(),
  title: z.string().min(1, 'Title is required'),
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createPost(formData: FormData) {
  const result = postSchema.safeParse({
    content: formData.get('content'),
    description: formData.get('description'),
    published: formData.get('published') === 'on',
    title: formData.get('title'),
  });

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { title, description, content, published } = result.data;

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
    data: { content, description, published, slug, title },
  });

  updateTag('posts');
}

export async function updatePost(slug: string, formData: FormData) {
  const result = postSchema.safeParse({
    content: formData.get('content'),
    description: formData.get('description'),
    published: formData.get('published') === 'on',
    title: formData.get('title'),
  });

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const { title, description, content, published } = result.data;

  await slow();
  await prisma.post.update({
    data: { content, description, published, title },
    where: { slug },
  });

  updateTag('posts');
  updateTag(`post-${slug}`);
}

export async function deletePost(slug: string) {
  await slow();
  await prisma.post.delete({
    where: { slug },
  });

  updateTag('posts');
  updateTag(`post-${slug}`);
}

export async function toggleArchivePost(slug: string, archived: boolean) {
  await slow();
  await prisma.post.update({
    data: { archived },
    where: { slug },
  });

  updateTag('posts');
  updateTag(`post-${slug}`);
}
