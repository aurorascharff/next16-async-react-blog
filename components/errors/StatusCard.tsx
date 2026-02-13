import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

type Props = {
  icon?: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function StatusCard({ icon: Icon, title, description, children }: Props) {
  return (
    <Card className="text-center">
      <CardHeader>
        {Icon && (
          <div className="mx-auto mb-2">
            <Icon className="text-muted-foreground size-8" />
          </div>
        )}
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
