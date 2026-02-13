import { BackButton } from '@/components/BackButton';

export default function NewPostLayout({ children }: LayoutProps<'/dashboard/new'>) {
  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        {children}
      </div>
    </div>
  );
}
