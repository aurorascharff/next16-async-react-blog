'use client';

import { ArrowDownAZ, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
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

  const { currentIcon: CurrentIcon, currentLabel, nextSort } = getSortInfo(currentSort);

  function handleClick() {
    router.push(`/dashboard?filter=${currentFilter}&sort=${nextSort}`);
  }

  return (
    <button onClick={handleClick} className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'gap-2')}>
      <CurrentIcon className="size-4" />
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
