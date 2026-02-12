import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { ErrorBoundary } from '@/components/design/ErrorBoundary';
import { buttonVariants } from '@/components/ui/button';
import { PostList, PostListSkeleton } from './_components/PostList';
import { PostTabsSkeleton, PostTabs } from './_components/PostTabs';
import { SortButtonSkeleton, SortButton } from './_components/SortButton';

export default function DashboardPage({ searchParams }: PageProps<'/dashboard'>) {
  return (
    <div className="bg-muted/20 min-h-screen dark:bg-transparent">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage your blog posts</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Link href="/" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
              Go to Blog
            </Link>
            <Link href="/dashboard/new" className={buttonVariants({ size: 'lg' })}>
              Create Post
            </Link>
          </div>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <Suspense fallback={<PostTabsSkeleton />}>
            <PostTabs />
          </Suspense>
          <Suspense fallback={<SortButtonSkeleton />}>
            <SortButton />
          </Suspense>
        </div>
        <ErrorBoundary label="Failed to load posts" fullWidth>
          <Suspense
            fallback={
              <ViewTransition exit="slide-down">
                <PostListSkeleton />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" exit="slide-down">
              <PostList searchParams={searchParams} />
            </ViewTransition>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
