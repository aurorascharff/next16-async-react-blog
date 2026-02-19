'use client';

import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type { Route } from 'next';

type Props<T extends string = string> = VariantProps<typeof buttonVariants> & {
  href?: Route<T>;
  children?: React.ReactNode;
  className?: string;
};

export function BackButton<T extends string>({
  variant = 'ghost',
  size,
  className,
  href,
  children = '← Back',
}: Props<T>) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (href) {
          router.push(href);
        } else {
          router.back();
        }
      }}
      className={cn(buttonVariants({ size, variant }), className)}
    >
      {children}
    </button>
  );
}
