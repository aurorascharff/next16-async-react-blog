import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

type Props = {
  children: React.ReactNode;
};

export default function PostLayout({ children }: Props) {
  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6">
          <Link href="/posts" className={buttonVariants({ variant: 'ghost' })}>
            ← Back to posts
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
