import { ViewTransition } from 'react';
import { BackButton } from '@/components/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createPost } from '@/data/actions/post-actions';
import { PostForm } from '../_components/PostForm';

export default function NewPostPage() {
  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-6">
            <BackButton href="/dashboard" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <PostForm
                action={createPost}
                defaultValues={{ content: '', description: '', published: false, title: '' }}
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
