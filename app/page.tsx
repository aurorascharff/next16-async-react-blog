import Link from 'next/link';
import { ViewTransition } from 'react';

import { buttonVariants } from '@/components/ui/button';

export default function Page() {
  return (
    <ViewTransition enter="slide-from-left" exit="slide-to-left">
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="space-y-3 text-center">
          <h1 className="text-5xl font-bold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground text-lg">A simple CRUD app demo</p>
        </div>
        <Link href="/posts" className={buttonVariants({ size: 'lg' })}>
          View Posts
        </Link>
      </div>
    </ViewTransition>
  );
}
