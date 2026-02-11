'use client';

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-gray-50 p-4 antialiased dark:bg-gray-950">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 text-5xl">😵</div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            We&apos;re having some issues
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Something unexpected happened. Please try again, or contact support if the problem persists.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Try again
            </button>
            <a
              href="mailto:support@example.com"
              className="text-sm text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Contact support
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
