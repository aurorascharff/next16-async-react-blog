import Link from 'next/link';
import { ViewTransition } from 'react';

import { buttonVariants } from '@/components/ui/button';

export default function Page() {
  return (
    <ViewTransition enter="slide-from-left" exit="slide-to-left">
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        <div className="space-y-3 text-center">
          <h1 className="text-5xl font-bold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground text-lg">A simple blog demo with Next.js 16</p>
        </div>
        <div className="flex gap-4">
          <Link href="/blog" className={buttonVariants({ size: 'lg' })}>
            Read Blog
          </Link>
          <Link href="/posts" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
            Manage Posts
          </Link>
        </div>
      </div>
    </ViewTransition>
  );
}
