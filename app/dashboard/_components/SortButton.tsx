'use client';

import { ArrowDownAZ, ArrowDownUp, ArrowUpDown, Loader2 } from 'lucide-react';
import Link, { useLinkStatus } from 'next/link';
import { useSearchParams } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sortOptions = [
  { icon: ArrowUpDown, label: 'Newest', value: 'newest' },
  { icon: ArrowDownUp, label: 'Oldest', value: 'oldest' },
  { icon: ArrowDownAZ, label: 'Title', value: 'title' },
] as const;

type SortValue = (typeof sortOptions)[number]['value'];

export function SortButton() {
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get('sort') as SortValue) ?? 'newest';
  const currentFilter = searchParams.get('filter') ?? 'all';

  const currentIndex = sortOptions.findIndex(opt => {
    return opt.value === currentSort;
  });
  const nextIndex = (currentIndex + 1) % sortOptions.length;
  const nextSort = sortOptions[nextIndex].value;
  const CurrentIcon = sortOptions[currentIndex].icon;

  return (
    <Link
      href={`/dashboard?filter=${currentFilter}&sort=${nextSort}`}
      prefetch={false}
      className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'gap-2')}
    >
      <SortIndicator icon={CurrentIcon} label={sortOptions[currentIndex].label} />
    </Link>
  );
}

function SortIndicator({ icon: Icon, label }: { icon: typeof ArrowUpDown; label: string }) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
      <span className="hidden sm:inline">{label}</span>
    </>
  );
}

export function SortButtonSkeleton() {
  return <div className="bg-muted h-9 w-9 animate-pulse rounded-md sm:w-24" />;
}
