import { Calendar, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { BackButton } from '@/components/BackButton';
import { MarkdownContent } from '@/components/Markdown';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CenteredSpinner } from '@/components/ui/spinner';
import { getPostBySlug } from '@/data/queries/post';
import { formatDate, getWordCount, slow } from '@/lib/utils';
import { DeletePostButton } from './_components/DeletePostButton';

export default async function PostPage({ params }: PageProps<'/dashboard/[slug]'>) {
  const { slug } = await params;

  return (
    <>
      <div className="mb-6">
        <BackButton href="/dashboard" />
      </div>
      <Suspense fallback={<CenteredSpinner />}>
        <PostHeader slug={slug} />
      </Suspense>
      <Separator className="my-6" />
      <Suspense fallback={<CenteredSpinner />}>
        <PostContent slug={slug} />
      </Suspense>
    </>
  );
}

async function PostHeader({ slug }: { slug: string }) {
  await slow(2000);
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
      <div className="w-full space-y-4 sm:w-auto sm:space-y-2">
        <Skeleton className="h-10 w-48 sm:h-8 sm:w-64" />
        <Skeleton className="h-8 w-full sm:h-6 sm:w-96" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-y-1">
          <Skeleton className="h-7 w-20 sm:h-4" />
          <Skeleton className="h-7 w-28 sm:h-4" />
          <Skeleton className="h-7 w-20 sm:h-4" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-14 sm:h-10" />
        <Skeleton className="h-10 w-18 sm:h-10" />
      </div>
    </div>
  );
}

export function PostContentSkeleton() {
  return <Skeleton className="h-64 w-full" />;
}
