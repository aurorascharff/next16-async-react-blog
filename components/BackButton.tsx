import Link from 'next/link';
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
  return (
    <Link href={href} className={cn(buttonVariants({ size, variant }), className)}>
      {children}
    </Link>
  );
}
