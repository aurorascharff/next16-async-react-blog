'use client';

import { Loader2 } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';

import { Tabs, TabsList as BaseTabsList, TabsTrigger, tabsListVariants } from '@/components/ui/tabs';

type Tab = {
  label: string;
  value: string;
};

type TabListProps = {
  tabs: Tab[];
  activeTab: string;
  changeAction?: (value: string) => void | Promise<void>;
  onChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
};

export function TabList({ tabs, activeTab, changeAction, onChange, className, children }: TabListProps) {
  const [optimisticTab, setOptimisticTab] = useOptimistic(activeTab);
  const [isPending, startTransition] = useTransition();

  function handleTabChange(value: string) {
    onChange?.(value);
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
                onClick={() => {
                  handleTabChange(tab.value);
                }}
              >
                {tab.label}
              </TabsTrigger>
            );
          })}
        </BaseTabsList>
        {isPending && <Loader2 className="text-muted-foreground size-4 animate-spin" />}
      </div>
      {children}
    </Tabs>
  );
}

export { Tabs, TabsTrigger, tabsListVariants };
