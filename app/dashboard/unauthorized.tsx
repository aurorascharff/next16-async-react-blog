import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen justify-center px-4 pt-24">
      <Card className="h-fit w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Unauthorized</CardTitle>
          <CardDescription>You need to be logged in to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants()}>
            Back to Blog
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

