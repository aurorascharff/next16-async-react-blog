'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useTrackError } from '@/hooks/useTrackError';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  label?: string;
  fullWidth?: boolean;
};

function ErrorFallback({
  label,
  fullWidth,
  error,
  resetErrorBoundary,
}: {
  label: string;
  fullWidth?: boolean;
  error: Error;
  resetErrorBoundary: () => void;
}) {
  useTrackError(error);

  return (
    <div
      className={cn(
        'bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-3 rounded-lg border px-4 py-3',
        fullWidth ? 'w-full' : 'w-fit',
      )}
    >
      <AlertCircle className="size-4 shrink-0" />
      <span className="text-sm">{label}</span>
      <button
        onClick={resetErrorBoundary}
        className="text-destructive hover:bg-destructive/20 ml-auto cursor-pointer rounded p-1 transition-colors"
        aria-label="Retry"
      >
        <RefreshCw className="size-4" />
      </button>
    </div>
  );
}

const shouldRethrow = (error: Error) => {
  // Next.js errors that should not be caught by the error boundary
  return (
    error.toString().startsWith('Error: NEXT_HTTP_ERROR_FALLBACK;') ||
    error.toString().startsWith('Error: NEXT_REDIRECT')
  );
};

export function ErrorBoundary({ children, label = 'Something went wrong', fullWidth = false }: Props) {
  return (
    <ReactErrorBoundary
      onError={error => {
        if (error instanceof Error && shouldRethrow(error)) {
          throw error;
        }
      }}
      fallbackRender={({ error, resetErrorBoundary }) => {
        const errorInstance = error instanceof Error ? error : new Error(String(error));
        return (
          <ErrorFallback
            label={label}
            fullWidth={fullWidth}
            error={errorInstance}
            resetErrorBoundary={resetErrorBoundary}
          />
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
