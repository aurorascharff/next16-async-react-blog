import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PostNotFound() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <BackButton href="/" size="sm" className="mb-8">
          ← Back to blog
        </BackButton>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Post Not Found</CardTitle>
            <CardDescription className="text-base">
              The post you&apos;re looking for doesn&apos;t exist or has been deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" className={buttonVariants({ variant: 'default' })}>
              Back to blog
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
