import Link from 'next/link';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { PostList, PostListSkeleton } from './_components/PostList';
import { PostTabs, PostTabsSkeleton } from './_components/PostTabs';

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default function PostsPage({ searchParams }: Props) {
  return (
    <ViewTransition enter="slide-from-left" exit="slide-to-left">
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Posts</h1>
              <p className="text-muted-foreground mt-1">Manage your blog posts</p>
            </div>
            <Link href="/posts/new" className={buttonVariants({ size: 'lg' })}>
              Create Post
            </Link>
          </div>
          <div className="mb-6">
            <Suspense fallback={<PostTabsSkeleton />}>
              <PostTabs />
            </Suspense>
          </div>
          <Suspense fallback={<PostListSkeleton />}>
            <PostList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </ViewTransition>
  );
}
