import React from 'react';
import { ViewTransition } from 'react';

export function SlideLeftTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="slide-from-left" exit="slide-to-left" default="none">
      {children}
    </ViewTransition>
  );
}

export function SlideRightTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="slide-from-right" exit="slide-to-right" default="none">
      {children}
    </ViewTransition>
  );
}
