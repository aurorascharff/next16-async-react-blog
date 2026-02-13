import { LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { StatusCard } from '@/components/errors/StatusCard';
import { buttonVariants } from '@/components/ui/button';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen justify-center px-4 pt-24">
      <div className="h-fit w-full max-w-md">
        <StatusCard
          icon={LockKeyhole}
          title="Unauthorized"
          description="You need to be logged in to access the dashboard."
        >
          <Link href="/" className={buttonVariants()}>
            Back to Blog
          </Link>
        </StatusCard>
      </div>
    </div>
  );
}
