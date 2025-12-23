import Link from 'next/link';
import { ViewTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPublishedPosts } from '@/data/queries/post-queries';

export default function BlogPage() {
  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
              <p className="text-muted-foreground mt-1">Thoughts, ideas, and tutorials</p>
            </div>
            <Link href="/posts" target="_blank" className={buttonVariants({ variant: 'outline' })}>
              Manage
            </Link>
          </div>
          <BlogList />
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
