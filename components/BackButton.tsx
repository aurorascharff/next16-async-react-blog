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
  href?: Route;
};

export function BackButton({ variant = 'ghost', size, className, href, children = '← Back' }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        const savedPosition = href ? Number(sessionStorage.getItem(`scroll-${href}`) || '0') : 0;
        startTransition(() => {
          if (href) {
            router.push(href);
          } else {
            router.back();
          }
        });
        if (href) {
          setTimeout(() => {
            window.scrollTo({ top: savedPosition });
          }, 100);
        }
      }}
      className={cn(buttonVariants({ size, variant }), className)}
    >
      {children}
    </button>
  );
}
