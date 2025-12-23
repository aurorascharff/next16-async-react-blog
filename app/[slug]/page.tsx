import { Calendar, Clock, FileText } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { MarkdownContent } from '@/components/Markdown';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getPublishedPostBySlug, getPublishedPosts } from '@/data/queries/post-queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  return {
    description: post.description || undefined,
    title: post.title,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  const createdDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const updatedDate = new Date(post.updatedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const wasUpdated = post.updatedAt > post.createdAt;
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <div className="min-h-screen">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <Link href="/" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'mb-8' })}>
            ← Back to blog
          </Link>
          <article>
            <MarkdownContent>{post.content}</MarkdownContent>
            <Separator className="mt-12 mb-6" />
            <footer className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {createdDate}
              </span>
              {wasUpdated && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Updated {updatedDate}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {wordCount} words
              </span>
            </footer>
          </article>
        </div>
      </div>
    </ViewTransition>
  );
}

