'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/design/SubmitButton';
import type { buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { Route } from 'next';

type Props<T extends string> = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    action: ((formData: FormData) => Promise<void>) | (() => Promise<void>);
    successMessage?: string;
    redirectTo?: Route<T>;
    loading?: boolean;
  };

export function ActionButton<T extends string>({ children, action, successMessage, redirectTo, ...props }: Props<T>) {
  const router = useRouter();

  async function formAction(formData: FormData) {
    try {
      await action(formData);
      if (successMessage) {
        toast.success(successMessage);
      }
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  }

  return (
    <SubmitButton formAction={formAction} {...props}>
      {children}
    </SubmitButton>
  );
}
