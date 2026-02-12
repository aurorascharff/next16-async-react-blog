'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type { Route } from 'next';

type Props = VariantProps<typeof buttonVariants> & {
  children?: React.ReactNode;
  className?: string;
  href: Route;
};

export function BackButton({ variant = 'ghost', size, className, href, children = '← Back' }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          router.back();
        });
      }}
      className={cn(buttonVariants({ size, variant }), className)}
    >
      {children}
    </button>
  );
}
