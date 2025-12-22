import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

import { PostList } from './_components/post-list';
import { PostTabs } from './_components/post-tabs';

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function PostsPage({ searchParams }: Props) {
  const { filter } = await searchParams;
  const validFilter = filter === 'published' || filter === 'drafts' ? filter : 'all';

  return (
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
          <PostTabs />
        </div>

        <PostList filter={validFilter} />
      </div>
    </div>
  );
}
