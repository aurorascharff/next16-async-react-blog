import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { deletePost } from '@/data/actions/post-actions';
import { getPostById } from '@/data/queries/post-queries';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const deletePostWithId = deletePost.bind(null, id);

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6">
          <Link href="/posts" className={buttonVariants({ variant: 'ghost' })}>
            ← Back to posts
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl font-bold tracking-tight">{post.title}</CardTitle>
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
              </div>
              <div className="flex gap-2">
                <Link href={`/posts/${id}/edit`} className={buttonVariants({ variant: 'outline' })}>
                  Edit
                </Link>
                <form action={deletePostWithId}>
                  <Button variant="destructive" type="submit">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
