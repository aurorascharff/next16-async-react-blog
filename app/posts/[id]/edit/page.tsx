import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updatePost } from '@/data/actions/post-actions';
import { getPostById } from '@/data/queries/post-queries';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    throw new Error('Post not found');
  }

  const updatePostWithId = updatePost.bind(null, id);

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6">
          <Link href={`/posts/${id}`} className={buttonVariants({ variant: 'ghost' })}>
            ← Back to post
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updatePostWithId} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={post.title}
                  placeholder="Enter post title"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={post.content}
                  placeholder="Write your post content..."
                  required
                  rows={10}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  defaultChecked={post.published}
                  className="border-input size-4 rounded"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Published
                </Label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" size="lg">
                  Save Changes
                </Button>
                <Link href={`/posts/${id}`} className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                  Cancel
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
