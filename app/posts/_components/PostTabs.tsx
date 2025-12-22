'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { TabList } from '@/components/design/TabList';

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

  function tabAction(value: string) {
    router.push(`/posts?filter=${value}`);
  }

  return <TabList tabs={tabs} activeTab={currentTab} changeAction={tabAction} />;
}
