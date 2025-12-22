import Link from 'next/link';
import { Suspense } from 'react';

import { ActionButton } from '@/components/design/ActionButton';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { updatePost } from '@/data/actions/post-actions';
import { getPostById } from '@/data/queries/post-queries';

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return [{ id: 'none' }];
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<EditPostPageSkeleton />}>
          <EditPostContent id={id} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function EditPostContent({ id }: { id: string }) {
  const post = await getPostById(id);

  return (
    <form className="space-y-6">
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
        <ActionButton
          action={updatePost.bind(null, post.id)}
          successMessage="Post updated successfully"
          redirectTo={`/posts/${post.id}`}
          size="lg"
        >
          Save Changes
        </ActionButton>
        <Link href={`/posts/${post.id}`} className={buttonVariants({ size: 'lg', variant: 'outline' })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

export function EditPostPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
