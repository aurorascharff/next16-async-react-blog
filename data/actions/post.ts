'use server';

import { refresh, revalidateTag } from 'next/cache';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import { z } from 'zod';
import { canManagePosts } from '@/data/queries/auth';
import { prisma } from '@/db';
import { slow } from '@/lib/utils';

// Set to false to allow editing/deleting seed posts
const PROTECT_SEED_POSTS = true;

async function checkSeedPostProtection(slug: string, action: string): Promise<ActionResult | null> {
  if (!PROTECT_SEED_POSTS) return null;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (post?.seed) {
    return { error: `Seed posts cannot be ${action}`, success: false };
  }
  return null;
}

function validateMarkdown(content: string): string | null {
  const tree = remark().parse(content);

  let hasH1 = false;
  visit(tree, 'heading', node => {
    if (node.depth === 1) {
      hasH1 = true;
    }
  });

  if (!hasH1) {
    return 'Content must have at least one h1 heading (# Heading)';
  }

  return null;
}

const postSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .check(ctx => {
      const error = validateMarkdown(ctx.value);
      if (error) {
        ctx.issues.push({ code: 'custom', input: ctx.value, message: error, path: [] });
      }
    }),
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

export type ActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
      formData?: { title: string; description: string; content: string; published: boolean };
    };

export async function createPost(formData: FormData): Promise<ActionResult> {
  if (!canManagePosts()) {
    return { error: 'Unauthorized', success: false };
  }

  const rawData = {
    content: (formData.get('content') as string) || '',
    description: (formData.get('description') as string) || '',
    published: formData.get('published') === 'on',
    title: (formData.get('title') as string) || '',
  };

  const result = postSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.issues[0].message, formData: rawData, success: false };
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

  revalidateTag('posts', 'max');
  refresh();
  return { success: true };
}

export async function updatePost(slug: string, formData: FormData): Promise<ActionResult> {
  if (!canManagePosts()) {
    return { error: 'Unauthorized', success: false };
  }

  const seedError = await checkSeedPostProtection(slug, 'edited');
  if (seedError) return seedError;

  const rawData = {
    content: (formData.get('content') as string) || '',
    description: (formData.get('description') as string) || '',
    published: formData.get('published') === 'on',
    title: (formData.get('title') as string) || '',
  };

  const result = postSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.issues[0].message, formData: rawData, success: false };
  }

  const { title, description, content, published } = result.data;

  await slow();
  await prisma.post.update({
    data: { content, description, published, title },
    where: { slug },
  });

  revalidateTag('posts', 'max');
  revalidateTag(`post-${slug}`, 'max');
  refresh();
  return { success: true };
}

export async function deletePost(slug: string): Promise<ActionResult> {
  if (!canManagePosts()) {
    return { error: 'Unauthorized', success: false };
  }

  const seedError = await checkSeedPostProtection(slug, 'deleted');
  if (seedError) return seedError;

  await slow();
  await prisma.post.delete({
    where: { slug },
  });

  revalidateTag('posts', 'max');
  revalidateTag(`post-${slug}`, 'max');
  refresh();
  return { success: true };
}

export async function toggleArchivePost(slug: string, archived: boolean): Promise<ActionResult> {
  if (!canManagePosts()) {
    return { error: 'Unauthorized', success: false };
  }

  // const seedError = await checkSeedPostProtection(slug, 'edited');
  // if (seedError) return seedError;

  await slow();
  await prisma.post.update({
    data: { archived },
    where: { slug },
  });

  revalidateTag('posts', 'max');
  revalidateTag(`post-${slug}`, 'max');
  refresh();
  return { success: true };
}
