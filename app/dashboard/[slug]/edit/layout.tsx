import { BackButton } from '@/components/BackButton';
import { SlideRightTransition } from '@/components/ui/animations';
import type { Route } from 'next';

export default async function EditPostLayout({ children, params }: LayoutProps<'/dashboard/[slug]/edit'>) {
  const { slug } = await params;

  return (
    <>
      <SlideRightTransition>
        <div className="mb-6">
          <BackButton href={`/dashboard/${slug}` as Route} />
        </div>
        {children}
      </SlideRightTransition>
    </>
  );
}
