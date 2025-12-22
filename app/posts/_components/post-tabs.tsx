'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Drafts', value: 'drafts' },
] as const;

export function PostTabs() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('filter') ?? 'all';

  return (
    <Tabs value={currentTab}>
      <TabsList>
        {tabs.map(tab => {
          return (
            <TabsTrigger key={tab.value} value={tab.value} render={<Link href={`/posts?filter=${tab.value}`} />}>
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
