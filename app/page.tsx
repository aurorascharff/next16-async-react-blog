import { Github } from 'lucide-react';
import Link from 'next/link';
import { SlideRightTransition } from '@/components/ui/animations';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { canManagePosts } from '@/data/queries/auth';
import { getPublishedPosts } from '@/data/queries/post';
import { formatDate, getReadTime } from '@/lib/utils';

export default function HomePage() {
  const showDashboard = canManagePosts();

  return (
    <SlideRightTransition>
      <div className="min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Next.js 16 Async React</h1>
              <p className="text-muted-foreground mt-1">Async patterns for polished user experiences</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                target="_blank"
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
        </div>
        <BlogList />
      </div>
    </SlideRightTransition>
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
