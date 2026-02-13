import { Calendar, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { MarkdownContent } from '@/components/Markdown';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getPostBySlug } from '@/data/queries/post';
import { formatDate, getWordCount } from '@/lib/utils';
import { DeletePostButton } from './_components/DeletePostButton';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    description: post.description || undefined,
    title: post.title,
  };
}

export default async function PostPage({ params }: PageProps<'/dashboard/[slug]'>) {
  const { slug } = await params;

  return (
    <>
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <PostHeaderSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" exit="slide-down" default="none">
          <PostHeader slug={slug} />
        </ViewTransition>
      </Suspense>
      <Separator className="my-6" />
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <PostContentSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" exit="slide-down" default="none">
          <PostContent slug={slug} />
        </ViewTransition>
      </Suspense>
    </>
  );
}

async function PostHeader({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);
  const wasUpdated = post.updatedAt > post.createdAt;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{post.title}</h1>
        {post.description && <p className="text-muted-foreground">{post.description}</p>}
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Badge variant={post.published ? 'default' : 'secondary'}>{post.published ? 'Published' : 'Draft'}</Badge>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(post.createdAt)}
          </span>
          {wasUpdated && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated {formatDate(post.updatedAt)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            {getWordCount(post.content)} words
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`/dashboard/${post.slug}/edit`} className={buttonVariants({ variant: 'outline' })}>
          Edit
        </Link>
        <DeletePostButton slug={post.slug} />
      </div>
    </div>
  );
}

async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  return <MarkdownContent>{post.content}</MarkdownContent>;
}

export function PostHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="w-full space-y-2 sm:w-auto">
        <Skeleton className="h-10 w-full sm:h-8 sm:w-64" />
        <Skeleton className="h-10 w-full sm:h-5 sm:w-96" />
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-10 w-20 sm:h-5" />
          <Skeleton className="h-10 w-36 sm:h-5" />
          <Skeleton className="h-10 w-20 sm:h-5" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-14" />
        <Skeleton className="h-9 w-18" />
      </div>
    </div>
  );
}

export function PostContentSkeleton() {
  return <Skeleton className="h-64 w-full" />;
}
