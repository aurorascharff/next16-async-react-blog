'use client';

import { useOptimistic, useTransition } from 'react';
import { Tabs, TabsList as BaseTabsList, TabsTrigger, tabsListVariants } from '@/components/ui/tabs';
import { Spinner } from '../ui/spinner';

type Tab = {
  label: string;
  value: string;
};

type TabListProps = {
  tabs: Tab[];
  activeTab: string;
  changeAction?: (value: string) => void | Promise<void>;
  onChange?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export function TabList({ tabs, activeTab, changeAction, onChange, className }: TabListProps) {
  const [optimisticTab, setOptimisticTab] = useOptimistic(activeTab);
  const [isPending, startTransition] = useTransition();

  function handleTabChange(e: React.MouseEvent<HTMLButtonElement>, value: string) {
    onChange?.(e);
    if (changeAction) {
      startTransition(async () => {
        setOptimisticTab(value);
        await changeAction?.(value);
      });
    }
  }

  return (
    <Tabs value={optimisticTab} className={className}>
      <div className="flex items-center gap-3">
        <BaseTabsList>
          {tabs.map(tab => {
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                onClick={e => {
                  handleTabChange(e, tab.value);
                }}
              >
                {tab.label}
              </TabsTrigger>
            );
          })}
        </BaseTabsList>
        {isPending && <Spinner />}
      </div>
    </Tabs>
  );
}

export { Tabs, TabsTrigger, tabsListVariants };
