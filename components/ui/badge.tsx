import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'h-5 gap-1 rounded-md border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default:
          'bg-primary/15 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
        destructive:
          'bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        info: 'bg-sky-500/15 text-sky-600 border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30',
        link: 'text-primary underline-offset-4 hover:underline',
        outline: 'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        secondary: 'bg-secondary text-secondary-foreground border-border/50 dark:border-border',
        success:
          'bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
        warning:
          'bg-amber-500/15 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
      },
    },
  },
);

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge, badgeVariants };
