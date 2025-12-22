import Link from 'next/link';
import { ViewTransition } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPosts } from '@/data/queries/post-queries';

const filterSchema = z.enum(['all', 'published', 'drafts']).catch('all');

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export async function PostList({ searchParams }: Props) {
  const { filter } = await searchParams;
  const validFilter = filterSchema.parse(filter);
  const posts = await getPosts(validFilter);

  if (posts.length === 0) {
    return (
      <Card className="py-16 text-center">
        <CardContent>
          <p className="text-muted-foreground text-lg">
            {validFilter === 'drafts'
              ? 'No drafts yet.'
              : validFilter === 'published'
                ? 'No published posts yet.'
                : 'No posts yet. Create your first post!'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => {
        return (
          <Link key={post.id} href={`/posts/${post.id}`} className="block">
            <ViewTransition name={`post-card-${post.id}`} share="morph">
              <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    {!post.published && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Draft
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">{post.content}</p>
                </CardContent>
              </Card>
            </ViewTransition>
          </Link>
        );
      })}
    </div>
  );
}

export function PostListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => {
        return (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
