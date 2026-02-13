'use client';

import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

type Props = VariantProps<typeof buttonVariants> & {
  children?: React.ReactNode;
  className?: string;
};

export function BackButton({ variant = 'ghost', size, className, children = '← Back' }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.back();
      }}
      className={cn(buttonVariants({ size, variant }), className)}
    >
      {children}
    </button>
  );
}
