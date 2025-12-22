import Link from 'next/link';
import { ViewTransition } from 'react';

import { ActionButton } from '@/components/design/ActionButton';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createPost } from '@/data/actions/post-actions';

export default function NewPostPage() {
  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right">
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <div className="mb-6">
            <Link href="/posts" className={buttonVariants({ variant: 'ghost' })}>
              ← Back to posts
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="Enter post title" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your post content..."
                    required
                    rows={10}
                    className="resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="published" name="published" className="border-input size-4 rounded" />
                  <Label htmlFor="published" className="cursor-pointer">
                    Publish immediately
                  </Label>
                </div>
                <div className="flex gap-3 pt-2">
                  <ActionButton
                    action={createPost}
                    successMessage="Post created successfully"
                    redirectTo="/posts"
                    size="lg"
                  >
                    Create Post
                  </ActionButton>
                  <Link href="/posts" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                    Cancel
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ViewTransition>
  );
}
