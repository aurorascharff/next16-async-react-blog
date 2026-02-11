'use client';

import { Archive } from 'lucide-react';
import { useOptimistic } from 'react';
import { toggleArchivePost } from '@/data/actions/post-actions';
import { cn } from '@/lib/utils';

type Props = {
  slug: string;
  archived: boolean | null;
};

export function ArchiveButton({ slug, archived }: Props) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived ?? false);
  const isPending = optimisticArchived !== (archived ?? false);

  return (
    <form
      data-pending={isPending || undefined}
      action={async () => {
        let newValue: boolean;
        setOptimisticArchived(current => {
          newValue = !current;
          return newValue;
        });
        await toggleArchivePost(slug, newValue!);
      }}
      onClick={e => {
        return e.stopPropagation();
      }}
    >
      <button
        type="submit"
        aria-label={optimisticArchived ? 'Unarchive post' : 'Archive post'}
        className={cn(
          'group rounded-md p-1.5 transition-colors disabled:opacity-50',
          optimisticArchived ? 'bg-primary/15' : 'hover:bg-muted',
        )}
      >
        <Archive
          strokeWidth={optimisticArchived ? 2.5 : 1.5}
          className={cn(
            'size-4 transition-colors',
            optimisticArchived ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
      </button>
    </form>
  );
}
