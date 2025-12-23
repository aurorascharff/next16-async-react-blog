import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PostHeaderSkeleton } from './page';

export default function PostLoading() {
  return (
    <article>
      <PostHeaderSkeleton />
      <Separator className="my-6" />
      <Skeleton className="h-64 w-full" />
    </article>
  );
}
