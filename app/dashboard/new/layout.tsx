import { BackButton } from '@/components/BackButton';
import { SlideLeftTransition } from '@/components/ui/animations';

export default function NewPostLayout({ children }: LayoutProps<'/dashboard/new'>) {
  return (
    <SlideLeftTransition>
      <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-6">
            <BackButton href="/dashboard" />
          </div>
          {children}
        </div>
      </div>
    </SlideLeftTransition>
  );
}
