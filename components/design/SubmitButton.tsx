'use client';

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import type { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';

type Props = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function SubmitButton({ children, loading, disabled, ...props }: Props) {
  const { pending } = useFormStatus();
  const isSubmitting = loading || pending;

  return (
    <Button type="submit" disabled={isSubmitting || disabled} {...props}>
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          {children}
          <Loader2 className="size-4 animate-spin" />
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
