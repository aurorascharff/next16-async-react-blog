import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createPost } from '@/data/actions/post';
import { PostForm } from '../_components/PostForm';

export default function NewPostPage() {
  throw new Error('Test error in PostHeader');

  return (
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
  );
}
