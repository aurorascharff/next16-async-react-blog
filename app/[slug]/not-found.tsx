import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import { StatusCard } from '@/components/errors/StatusCard';
import { buttonVariants } from '@/components/ui/button';

export default function PostNotFound() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <BackButton href="/" size="sm" className="mb-8">
          ← Back to blog
        </BackButton>
        <StatusCard
          icon={FileQuestion}
          title="Post Not Found"
          description="The post you're looking for doesn't exist or has been deleted."
        >
          <Link href="/" className={buttonVariants({ variant: 'default' })}>
            Back to blog
          </Link>
        </StatusCard>
      </div>
    </div>
  );
}
