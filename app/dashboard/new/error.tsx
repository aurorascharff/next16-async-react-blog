'use client';

import { ErrorCard } from '@/components/design/ErrorCard';
import { useTrackError } from '@/hooks/useTrackError';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function NewPostError({ error, reset }: Props) {
  useTrackError(error);
  return <ErrorCard error={error} reset={reset} description="An unexpected error occurred while creating this post." />;
}
