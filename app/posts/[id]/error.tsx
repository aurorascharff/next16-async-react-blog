'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PostsError({ error, reset }: Props) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto flex max-w-2xl items-center justify-center px-4 py-24">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Something went wrong!</CardTitle>
            <CardDescription className="text-base">
              {error.message || 'An unexpected error occurred while loading posts.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-3">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Link href="/posts" className={buttonVariants({ variant: 'outline' })}>
              Back to posts
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
