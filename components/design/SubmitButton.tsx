'use client';

import { useFormStatus } from 'react-dom';
import type { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Spinner } from '../ui/spinner';
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
          <Spinner />
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
