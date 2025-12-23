import { Github } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { canManagePosts } from '@/data/queries/auth-queries';
import { getPublishedPosts } from '@/data/queries/post-queries';
import { formatDate, getReadTime } from '@/lib/utils';

export default function HomePage() {
  const showDashboard = canManagePosts();

  return (
    <ViewTransition enter="slide-from-left" exit="slide-to-left">
      <div className="min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
              <p className="text-muted-foreground mt-1">Next.js 16 patterns explained</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/aurorascharff/next16-interactive-posts"
                rel="noopener noreferrer"
                className={buttonVariants({ size: 'icon', variant: 'ghost' })}
                aria-label="View source on GitHub"
              >
                <Github className="size-5" />
              </a>
              {showDashboard && (
                <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
                  Dashboard
                </Link>
              )}
            </div>
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
        return (
          <Link key={post.slug} href={`/${post.slug}`} className="block">
            <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm">
                  {formatDate(post.createdAt)}
                  {' · '}
                  {getReadTime(post.content)} min read
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
