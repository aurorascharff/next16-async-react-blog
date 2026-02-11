import { Calendar, Clock, FileText } from 'lucide-react';
import { ViewTransition } from 'react';
import { BackButton } from '@/components/BackButton';
import { MarkdownContent } from '@/components/Markdown';
import { Separator } from '@/components/ui/separator';
import { getPublishedPostBySlug, getPublishedPosts } from '@/data/queries/post';
import { formatDate, getWordCount } from '@/lib/utils';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(post => {
    return { slug: post.slug };
  });
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

  const wasUpdated = post.updatedAt > post.createdAt;

  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <div className="min-h-screen">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <BackButton href="/" size="sm" className="mb-8">
            ← Back to blog
          </BackButton>
          <article>
            <MarkdownContent>{post.content}</MarkdownContent>
            <Separator className="mt-12 mb-6" />
            <footer className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              {wasUpdated && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Updated {formatDate(post.updatedAt)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {getWordCount(post.content)} words
              </span>
            </footer>
          </article>
        </div>
      </div>
    </ViewTransition>
  );
}
