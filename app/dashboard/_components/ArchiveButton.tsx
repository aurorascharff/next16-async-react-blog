'use client';

import { Archive } from 'lucide-react';

import { toggleArchivePost } from '@/data/actions/post';
import { cn } from '@/lib/utils';

type Props = {
  slug: string;
  archived: boolean | null;
};

export function ArchiveButton({ slug, archived }: Props) {
  return (
    <form
      action={async () => {
        const newValue = !archived;
        const result = await toggleArchivePost(slug, newValue);
        if (!result.success) {
          // Do nothing
        }
      }}
      onClick={e => {
        return e.stopPropagation();
      }}
    >
      <button
        type="submit"
        aria-label={archived ? 'Unarchive post' : 'Archive post'}
        className={cn(
          'group rounded-md p-1.5 transition-colors disabled:opacity-50',
          archived ? 'bg-primary/15' : 'hover:bg-muted',
        )}
      >
        <Archive
          strokeWidth={archived ? 2.5 : 1.5}
          className={cn(
            'size-4 transition-colors',
            archived ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
      </button>
    </form>
  );
}
