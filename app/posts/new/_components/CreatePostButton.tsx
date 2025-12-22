'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { SubmitButton } from '@/components/design/SubmitButton';
import { createPost } from '@/data/actions/post-actions';

export function CreatePostButton() {
  const router = useRouter();

  async function submitAction(formData: FormData) {
    await createPost(formData);
    toast.success('Post created successfully');
    router.push('/posts');
  }

  return (
    <SubmitButton size="lg" formAction={submitAction}>
      Create Post
    </SubmitButton>
  );
}
