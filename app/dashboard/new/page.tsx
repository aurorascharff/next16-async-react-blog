import Link from 'next/link';
import { ViewTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createPost } from '@/data/actions/post-actions';
import { PostForm } from '../_components/PostForm';

export default function NewPostPage() {
  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-6">
            <Link href="/dashboard" className={buttonVariants({ variant: 'ghost' })}>
              ← Back to posts
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <PostForm
                action={createPost}
                defaultValues={{ title: '', description: '', content: '', published: false }}
                submitLabel="Create Post"
                successMessage="Post created successfully"
                redirectTo="/dashboard"
                cancelHref="/dashboard"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ViewTransition>
  );
}
