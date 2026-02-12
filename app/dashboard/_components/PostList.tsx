import Link from 'next/link';

import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPosts } from '@/data/queries/post';
import { formatDate } from '@/lib/utils';
import { ArchiveButton } from './ArchiveButton';

const filterSchema = z.enum(['all', 'published', 'drafts', 'archived']).catch('all');
const sortSchema = z.enum(['newest', 'oldest', 'title']).catch('newest');

type Props = {
  searchParams: Promise<{ filter?: string; sort?: string }>;
};

export async function PostList({ searchParams }: Props) {
  const { filter, sort } = await searchParams;
  const validFilter = filterSchema.parse(filter);
  const validSort = sortSchema.parse(sort);
  const posts = await getPosts(validFilter, validSort);

  if (posts.length === 0) {
    return (
      <Card className="py-16 text-center">
        <CardContent>
          <p className="text-muted-foreground text-lg">
            {validFilter === 'archived'
              ? 'No archived posts.'
              : validFilter === 'drafts'
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
          <Link key={post.slug} href={`/dashboard/${post.slug}`} className="block">
            <Card className="hover:bg-muted/50 has-data-pending:bg-muted/70 transition-all duration-200 hover:shadow-md has-data-pending:animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    {!post.published && <Badge variant="warning">Draft</Badge>}
                  </div>
                  <ArchiveButton slug={post.slug} archived={post.archived} />
                </div>
                <CardDescription className="text-sm">{formatDate(post.createdAt)}</CardDescription>
              </CardHeader>
              {post.description && (
                <CardContent className="pt-0">
                  <p className="text-muted-foreground line-clamp-2 leading-relaxed">{post.description}</p>
                </CardContent>
              )}
            </Card>
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
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
