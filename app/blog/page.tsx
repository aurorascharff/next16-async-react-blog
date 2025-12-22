import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPublishedPosts } from '@/data/queries/post-queries';

export default function BlogPage() {
  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
            <p className="text-muted-foreground mt-1">Thoughts, ideas, and tutorials</p>
          </div>
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogList />
          </Suspense>
        </div>
      </div>
    </ViewTransition>
  );
}

async function BlogList() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <Card className="py-16 text-center">
        <CardContent>
          <p className="text-muted-foreground text-lg">No posts yet. Check back soon!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => {
        const wordCount = post.content.split(/\s+/).filter(Boolean).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        return (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
            <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {' · '}
                  {readTime} min read
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground line-clamp-2 leading-relaxed">{post.content}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => {
        return (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
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
