import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
};

export function ErrorCard({ error, reset, title = 'Something went wrong!', description }: Props) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto mb-2">
          <AlertCircle className="text-destructive size-8" />
        </div>
        <CardTitle className="text-destructive text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">
          {description || error.message || 'An unexpected error occurred.'}
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
