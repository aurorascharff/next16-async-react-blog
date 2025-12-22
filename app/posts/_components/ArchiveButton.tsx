'use client';

import { Archive } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { toggleArchivePost } from '@/data/actions/post-actions';

type Props = {
  slug: string;
  archived: boolean | null;
};

export function ArchiveButton({ slug, archived }: Props) {
  const [optimisticArchived, setOptimisticArchived] = useOptimistic(archived ?? false);
  const [isPending, startTransition] = useTransition();

  function handleInteraction(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  function pressedAction() {
    startTransition(async () => {
      setOptimisticArchived(!optimisticArchived);
      await toggleArchivePost(slug, !optimisticArchived);
    });
  }

  return (
    <span onClick={handleInteraction} onKeyDown={handleInteraction} role="presentation">
      <Toggle
        pressed={optimisticArchived}
        onPressedChange={pressedAction}
        disabled={isPending}
        size="sm"
        aria-label={optimisticArchived ? 'Unarchive post' : 'Archive post'}
      >
        <Archive className={optimisticArchived ? 'text-primary' : ''} />
      </Toggle>
    </span>
  );
}
