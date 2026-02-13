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
      <CardHeader className="pb-4">
        <div className="mx-auto mb-1">
          <AlertCircle className="text-destructive size-6" />
        </div>
        <CardTitle className="text-destructive text-base font-medium">{title}</CardTitle>
        <CardDescription className="text-sm">
          {description || error.message || 'An unexpected error occurred.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button onClick={reset} variant="default" size="sm">
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
