'use client';

import { ArrowDownAZ, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
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
  const [isPending, startTransition] = useTransition();

  const { currentIcon: CurrentIcon, currentLabel, nextSort } = getSortInfo(optimisticSort);

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          setOptimisticSort(nextSort);
          router.push(`/dashboard?filter=${currentFilter}&sort=${nextSort}`);
        });
      }}
      className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'gap-2')}
    >
      {isPending ? <Spinner /> : <CurrentIcon className="size-4" />}
      <span className="hidden sm:inline">{currentLabel}</span>
    </button>
  );
}

export function SortButtonSkeleton() {
  return <div className="bg-muted h-9 w-9 animate-pulse rounded-md sm:w-24" />;
}

function getSortInfo(currentSort: SortValue) {
  const currentIndex = sortOptions.findIndex(opt => {
    return opt.value === currentSort;
  });
  const nextIndex = (currentIndex + 1) % sortOptions.length;
  return {
    currentIcon: sortOptions[currentIndex].icon,
    currentLabel: sortOptions[currentIndex].label,
    nextSort: sortOptions[nextIndex].value,
  };
}
