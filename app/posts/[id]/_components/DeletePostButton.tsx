'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { SubmitButton } from '@/components/design/SubmitButton';
import { deletePost } from '@/data/actions/post-actions';

type Props = {
  postId: string;
};

export function DeletePostButton({ postId }: Props) {
  const router = useRouter();

  async function deleteAction() {
    await deletePost(postId);
    toast.success('Post deleted successfully');
    router.push('/posts');
  }

  return (
    <form action={deleteAction}>
      <SubmitButton variant="destructive">Delete</SubmitButton>
    </form>
  );
}
