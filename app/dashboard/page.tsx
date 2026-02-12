import Link from 'next/link';
import { unauthorized } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { canManagePosts } from '@/data/queries/auth';
import { PostList } from './_components/PostList';

export default function DashboardPage({ searchParams }: PageProps<'/dashboard'>) {
  if (!canManagePosts()) {
    unauthorized();
  }

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
        <PostList searchParams={searchParams} />
      </div>
    </div>
  );
}
