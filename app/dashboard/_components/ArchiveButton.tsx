'use client';

import { Archive } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { toggleArchivePost } from '@/data/actions/post-actions';

type Props = {
  slug: string;
  archived: boolean | null;
};

export function ArchiveButton({ slug, archived }: Props) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived ?? false);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    startTransition(async () => {
      setOptimisticArchived(!optimisticArchived);
      await toggleArchivePost(slug, !optimisticArchived);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={optimisticArchived ? 'Unarchive post' : 'Archive post'}
      className="group rounded-full p-2 transition-colors hover:bg-primary/10 disabled:opacity-50"
    >
      <Archive
        strokeWidth={optimisticArchived ? 2.5 : 1.5}
        className={cn(
          'size-[18px] transition-all',
          optimisticArchived ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
        )}
      />
    </button>
  );
}
