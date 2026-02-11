import { FileQuestion } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { StatusCard } from '@/components/design/StatusCard';

export default function PostNotFound() {
  return (
    <StatusCard
      icon={FileQuestion}
      title="Post Not Found"
      description="The post you're looking for doesn't exist or has been deleted."
    >
      <BackButton href="/dashboard" variant="default">
        Back to posts
      </BackButton>
    </StatusCard>
  );
}
