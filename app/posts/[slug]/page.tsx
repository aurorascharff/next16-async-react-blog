import { Calendar, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { MarkdownContent } from '@/components/Markdown';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getPostBySlug, getPublishedPosts } from '@/data/queries/post-queries';
import { DeletePostButton } from '../_components/DeletePostButton';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <ViewTransition name={`post-card-${slug}`} share="morph">
      <Card>
        <CardHeader className="pb-4">
          <Suspense fallback={<PostHeaderSkeleton />}>
            <PostHeader slug={slug} />
          </Suspense>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Suspense fallback={<Skeleton className="h-24 w-full" />}>
            <PostContent slug={slug} />
          </Suspense>
        </CardContent>
      </Card>
    </ViewTransition>
  );
}

async function PostHeader({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  const createdDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const updatedDate = new Date(post.updatedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const wasUpdated = post.updatedAt > post.createdAt;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-3">
        <CardTitle className="text-3xl font-bold tracking-tight">{post.title}</CardTitle>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Badge variant={post.published ? 'default' : 'secondary'}>{post.published ? 'Published' : 'Draft'}</Badge>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {createdDate}
          </span>
          {wasUpdated && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated {updatedDate}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            {post.content.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`/posts/${post.slug}/edit`} className={buttonVariants({ variant: 'outline' })}>
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

function PostHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
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
