import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostLoading() {
  return (
    <article>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-96" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-14" />
          <Skeleton className="h-9 w-[72px]" />
        </div>
      </div>
      <Separator className="my-6" />
      <Skeleton className="h-64 w-full" />
    </article>
  );
}

