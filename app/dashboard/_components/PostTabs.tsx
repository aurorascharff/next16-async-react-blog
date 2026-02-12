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

  function tabAction(value: string) {
    router.push(`/dashboard?filter=${value}&sort=${currentSort}`);
  }

  return <TabList tabs={tabs} activeTab={currentTab} onChange={tabAction} />;
}

export function PostTabsSkeleton() {
  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map(tab => {
        return <Skeleton key={tab.value} className="h-9 w-20 rounded-md" />;
      })}
    </div>
  );
}
