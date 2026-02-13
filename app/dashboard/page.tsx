import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { PostList } from './_components/PostList';
import { PostTabs, PostTabsSkeleton } from './_components/PostTabs';
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
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className={buttonVariants({ size: 'sm', variant: 'outline' }) + ' sm:size-auto sm:px-4 sm:py-2'}
            >
              Go to Blog
            </Link>
            <Link href="/dashboard/new" className={buttonVariants({ size: 'sm' }) + ' sm:size-auto sm:px-4 sm:py-2'}>
              <Plus className="size-4 sm:hidden" />
              <span className="hidden sm:inline">Create Post</span>
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
        <PostList searchParams={searchParams} />
      </div>
    </div>
  );
}
