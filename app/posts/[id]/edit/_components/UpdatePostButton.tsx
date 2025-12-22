'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { SubmitButton } from '@/components/design/SubmitButton';
import { updatePost } from '@/data/actions/post-actions';

type Props = {
  postId: string;
};

export function UpdatePostButton({ postId }: Props) {
  const router = useRouter();

  async function submitAction(formData: FormData) {
    await updatePost(postId, formData);
    toast.success('Post updated successfully');
    router.push(`/posts/${postId}`);
  }

  return (
    <SubmitButton size="lg" formAction={submitAction}>
      Save Changes
    </SubmitButton>
  );
}
