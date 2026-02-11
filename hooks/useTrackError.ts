'use client';

import { useEffect } from 'react';

export function useTrackError(error: Error) {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);
}
