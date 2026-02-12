'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollPositionSaver() {
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.href) {
        sessionStorage.setItem(`scroll-${pathname}`, String(window.scrollY));
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [pathname]);

  return null;
}
