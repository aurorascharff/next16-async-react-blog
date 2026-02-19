import { BackButton } from '@/components/BackButton';
import type { Route } from 'next';

export default async function EditPostLayout({ children, params }: LayoutProps<'/dashboard/[slug]/edit'>) {
  const { slug } = await params;

  return (
    <>
      <div className="mb-6">
        <BackButton href={`/dashboard/${slug}` as Route} />
      </div>
      {children}
    </>
  );
}
