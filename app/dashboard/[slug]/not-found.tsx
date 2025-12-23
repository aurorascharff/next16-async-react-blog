import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PostNotFound() {
  return (
    <Card className="w-full text-center">
      <CardHeader>
        <CardTitle className="text-2xl">Post Not Found</CardTitle>
        <CardDescription className="text-base">
          The post you&apos;re looking for doesn&apos;t exist or has been deleted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/dashboard" className={buttonVariants({ variant: 'default' })}>
          Back to posts
        </Link>
      </CardContent>
    </Card>
  );
}
