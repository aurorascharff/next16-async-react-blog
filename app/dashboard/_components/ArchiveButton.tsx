'use client';

import { Archive } from 'lucide-react';
import { useOptimistic } from 'react';
import { cn } from '@/lib/utils';
import { toggleArchivePost } from '@/data/actions/post-actions';

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
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="submit"
        aria-label={optimisticArchived ? 'Unarchive post' : 'Archive post'}
        className="group rounded-md p-1.5 transition-colors hover:bg-muted disabled:opacity-50"
      >
        <Archive
          strokeWidth={1.5}
          className={cn(
            'size-4 transition-colors',
            optimisticArchived ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
          )}
        />
      </button>
    </form>
  );
}
