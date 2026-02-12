import { getPosts } from '@/data/queries/post';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => {
    return { slug: post.slug };
  });
}

export default function PostLayout({ children }: LayoutProps<'/dashboard/[slug]'>) {
  return (
    <div>
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">{children}</div>
      </div>
    </div>
  );
}
