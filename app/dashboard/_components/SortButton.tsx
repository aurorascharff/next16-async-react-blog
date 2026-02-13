'use client';

import { ArrowDownAZ, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

const sortOptions = [
  { icon: ArrowUpDown, label: 'Newest', value: 'newest' },
  { icon: ArrowDownUp, label: 'Oldest', value: 'oldest' },
  { icon: ArrowDownAZ, label: 'Title', value: 'title' },
] as const;

type SortValue = (typeof sortOptions)[number]['value'];

export function SortButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get('sort') as SortValue) ?? 'newest';
  const currentFilter = searchParams.get('filter') ?? 'all';

  const [optimisticSort, setOptimisticSort] = useOptimistic(currentSort);
  const isPending = optimisticSort !== currentSort;

  const currentIndex = sortOptions.findIndex(opt => {
    return opt.value === optimisticSort;
  });
  const nextIndex = (currentIndex + 1) % sortOptions.length;
  const nextSort = sortOptions[nextIndex].value;
  const CurrentIcon = sortOptions[currentIndex].icon;

  return (
    <form
      data-pending={isPending || undefined}
      action={() => {
        setOptimisticSort(nextSort);
        router.push(`/dashboard?filter=${currentFilter}&sort=${nextSort}`);
      }}
    >
      <button type="submit" className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'gap-2')}>
        {isPending ? <Spinner /> : <CurrentIcon className="size-4" />}
        <span className="hidden sm:inline">{sortOptions[currentIndex].label}</span>
      </button>
    </form>
  );
}

export function SortButtonSkeleton() {
  return <div className="bg-muted h-9 w-9 animate-pulse rounded-md sm:w-24" />;
}
