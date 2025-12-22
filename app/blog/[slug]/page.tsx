import { Calendar, Clock, FileText } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { MarkdownContent } from '@/components/Markdown';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getPublishedPostBySlug } from '@/data/queries/post-queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  return {
    description: post.description || undefined,
    title: post.title,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <Link href="/blog" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'mb-6' })}>
            ← Back to blog
          </Link>
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
        </div>
      </div>
    </ViewTransition>
  );
}

async function PostHeader({ slug }: { slug: string }) {
  const post = await getPublishedPostBySlug(slug);

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
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <CardTitle className="text-3xl font-bold tracking-tight">{post.title}</CardTitle>
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
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
          {wordCount} words
        </span>
      </div>
    </div>
  );
}

async function PostContent({ slug }: { slug: string }) {
  const post = await getPublishedPostBySlug(slug);

  return <MarkdownContent>{post.content}</MarkdownContent>;
}

function PostHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-64" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}
