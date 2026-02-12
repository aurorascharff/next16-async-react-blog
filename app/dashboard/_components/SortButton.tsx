'use client';

import { ArrowDownAZ, ArrowDownUp, ArrowUpDown } from 'lucide-react';
import Link, { useLinkStatus } from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get('sort') as SortValue) ?? 'newest';
  const currentFilter = searchParams.get('filter') ?? 'all';

  const currentIndex = sortOptions.findIndex(opt => {
    return opt.value === currentSort;
  });
  const nextIndex = (currentIndex + 1) % sortOptions.length;
  const nextSort = sortOptions[nextIndex].value;

  return (
    <Link
      href={`/dashboard?filter=${currentFilter}&sort=${nextSort}`}
      prefetch={false}
      className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'gap-2')}
    >
      <span className="hidden sm:inline">{sortOptions[currentIndex].label}</span>
    </Link>
  );
}

export function SortButtonSkeleton() {
  return <div className="bg-muted h-9 w-9 animate-pulse rounded-md sm:w-24" />;
}

// eslint-disable-next-line autofix/no-unused-vars
function SortIndicator({ icon: Icon, label }: { icon: typeof ArrowUpDown; label: string }) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending ? <Spinner /> : <Icon className="size-4" />}
      <span className="hidden sm:inline">{label}</span>
    </>
  );
}
