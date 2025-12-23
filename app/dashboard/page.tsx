import Link from 'next/link';
import { unauthorized } from 'next/navigation';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { canManagePosts } from '@/data/queries/auth-queries';
import { PostList, PostListSkeleton } from './_components/PostList';
import { PostTabs, PostTabsSkeleton } from './_components/PostTabs';

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default function DashboardPage({ searchParams }: Props) {
  if (!canManagePosts()) {
    unauthorized();
  }

  return (
    <ViewTransition enter="slide-from-left" exit="slide-to-left">
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your blog posts</p>
            </div>
            <div className="flex gap-3">
              <Link href="/" target="_blank" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                Go to Blog
              </Link>
              <Link href="/dashboard/new" className={buttonVariants({ size: 'lg' })}>
                Create Post
              </Link>
            </div>
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
