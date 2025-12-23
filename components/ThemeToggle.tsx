'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 inline-flex items-center rounded-full border border-border bg-background/80 p-1 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          'rounded-full p-2 transition-colors',
          theme === 'light' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Light mode"
      >
        <Sun className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          'rounded-full p-2 transition-colors',
          theme === 'dark' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Dark mode"
      >
        <Moon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={cn(
          'rounded-full p-2 transition-colors',
          theme === 'system' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="System theme"
      >
        <Monitor className="size-4" />
      </button>
    </div>
  );
}

