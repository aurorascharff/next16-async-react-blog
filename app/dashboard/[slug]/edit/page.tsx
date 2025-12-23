import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { updatePost } from '@/data/actions/post-actions';
import { getPostBySlug } from '@/data/queries/post-queries';
import { PostForm } from '../../_components/PostForm';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<EditPostPageSkeleton />}>
          <EditPostContent slug={slug} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function EditPostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  return (
    <PostForm
      key={`${post.slug}-${post.updatedAt.getTime()}`}
      action={updatePost.bind(null, post.slug)}
      defaultValues={{
        title: post.title,
        description: post.description,
        content: post.content,
        published: post.published,
      }}
      submitLabel="Save Changes"
      successMessage="Post updated successfully"
      redirectTo={`/dashboard/${post.slug}`}
      cancelHref={`/dashboard/${post.slug}`}
    />
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
