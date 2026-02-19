import { ViewTransition } from 'react';
import { getPosts } from '@/data/queries/post';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => {
    return { slug: post.slug };
  });
}

export default async function PostLayout({ children, params }: LayoutProps<'/dashboard/[slug]'>) {
  const { slug } = await params;

  return (
    <div>
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <ViewTransition name={`post-card-${slug}`} share="morph" default="none">
            <article>{children}</article>
          </ViewTransition>
        </div>
      </div>
    </div>
  );
}
