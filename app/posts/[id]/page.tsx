import { Calendar, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getPostById } from '@/data/queries/post-queries';

import { DeletePostButton } from './_components/DeletePostButton';

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return [{ id: 'none' }];
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  return (
    <Card>
      <CardHeader className="pb-4">
        <Suspense fallback={<PostHeaderSkeleton />}>
          <PostHeader id={id} />
        </Suspense>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Suspense fallback={<Skeleton className="h-24 w-full" />}>
          <PostContent id={id} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function PostHeader({ id }: { id: string }) {
  const post = await getPostById(id);

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
        <div className="flex items-center gap-3">
          <CardTitle className="text-3xl font-bold tracking-tight">{post.title}</CardTitle>
          <Badge variant={post.published ? 'default' : 'secondary'}>{post.published ? 'Published' : 'Draft'}</Badge>
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Created {createdDate}
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
        <Link href={`/posts/${post.id}/edit`} className={buttonVariants({ variant: 'outline' })}>
          Edit
        </Link>
        <DeletePostButton postId={post.id} />
      </div>
    </div>
  );
}

async function PostContent({ id }: { id: string }) {
  const post = await getPostById(id);

  return <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>;
}

function PostHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-[22px] w-20 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
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
