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

  return (
    <form
      action={async () => {
        setOptimisticArchived(!optimisticArchived);
        await toggleArchivePost(slug, !optimisticArchived);
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
          optimisticArchived ? 'bg-foreground/10' : 'hover:bg-muted',
        )}
      >
        <Archive
          strokeWidth={optimisticArchived ? 2 : 1.5}
          className={cn(
            'size-4 transition-colors',
            optimisticArchived ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
      </button>
    </form>
  );
}
