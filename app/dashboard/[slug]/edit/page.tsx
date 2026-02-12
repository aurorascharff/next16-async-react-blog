import { Suspense, ViewTransition } from 'react';
import { BackButton } from '@/components/BackButton';
import { SlideRightTransition } from '@/components/ui/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { updatePost } from '@/data/actions/post';
import { getPostBySlug } from '@/data/queries/post';
import { PostForm } from '../../_components/PostForm';
import type { Route } from 'next';

export default async function EditPostPage({ params }: PageProps<'/dashboard/[slug]/edit'>) {
  const { slug } = await params;

  return (
    <SlideRightTransition>
      <div className="mb-6">
        <BackButton href={`/dashboard/${slug}` as Route} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <ViewTransition exit="slide-down">
                <EditPostPageSkeleton />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" exit="slide-down" default="none">
              <EditPostContent slug={slug} />
            </ViewTransition>
          </Suspense>
        </CardContent>
      </Card>
    </SlideRightTransition>
  );
}

async function EditPostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  return (
    <PostForm
      key={`${post.slug}-${post.updatedAt.getTime()}`}
      action={updatePost.bind(null, post.slug)}
      defaultValues={{
        content: post.content,
        description: post.description,
        published: post.published,
        title: post.title,
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
