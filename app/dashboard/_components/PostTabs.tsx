'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { TabList } from '@/components/design/TabList';
import { Skeleton } from '@/components/ui/skeleton';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Drafts', value: 'drafts' },
  { label: 'Archived', value: 'archived' },
];

export function PostTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('filter') ?? 'all';
  const currentSort = searchParams.get('sort') ?? 'newest';

  function changeTab(value: string) {
    router.push(`/dashboard?filter=${value}&sort=${currentSort}`);
  }

  return <TabList tabs={tabs} activeTab={currentTab} changeAction={changeTab} />;
}

export function PostTabsSkeleton() {
  return (
    <div className="inline-flex flex-wrap items-center gap-1">
      <Skeleton className="h-9 w-9 rounded-md" />
      <Skeleton className="h-9 w-17.5 rounded-md" />
      <Skeleton className="h-9 w-12 rounded-md" />
      <Skeleton className="h-9 w-16.5 rounded-md" />
    </div>
  );
}
