import { Calendar, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { MarkdownContent } from '@/components/Markdown';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getPostBySlug } from '@/data/queries/post-queries';
import { formatDate, getWordCount } from '@/lib/utils';
import { DeletePostButton } from '../_components/DeletePostButton';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <ViewTransition name={`post-card-${slug}`} share="morph">
      <article>
        <Suspense fallback={<PostHeaderSkeleton />}>
          <PostHeader slug={slug} />
        </Suspense>
        <Separator className="my-6" />
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <PostContent slug={slug} />
        </Suspense>
      </article>
    </ViewTransition>
  );
}

async function PostHeader({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);
  const wasUpdated = post.updatedAt > post.createdAt;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{post.title}</h1>
        {post.description && (
          <p className="text-muted-foreground">{post.description}</p>
        )}
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
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-5 w-96" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-14" />
        <Skeleton className="h-9 w-[72px]" />
      </div>
    </div>
  );
}
