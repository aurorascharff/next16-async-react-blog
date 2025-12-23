'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PostError({ error, reset }: Props) {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-2xl text-red-600">Something went wrong!</CardTitle>
        <CardDescription className="text-base">
          {error.message || 'An unexpected error occurred while loading this post.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset} variant="default">
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
