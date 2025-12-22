# Copilot Instructions

You are an expert in TypeScript, Node.js, Next.js App Router, React, TailwindCSS, Prisma, and shadcn/ui.
Before you ever suggest anything, review `package.json` to see what packages are available.

## Code Style

- Pascal case for components, kebab case for folders and files, camel case for utility functions and hooks.
- Suffix functions that run in transitions with "Action" (e.g., `submitAction`, `deleteAction`).
- Use `cn` util when merging conditional classes with other classes.
- Use Base UI for custom interactive UI components not in shadcn/ui.
- Add shadcn/ui components with `bunx shadcn@latest add <component-name>`.

## Folder Structure

- `app/` - Pages and layouts using file-based routing.
- `_components/` - Route-local components (prefixed with `_`).
- `components/` - Shared components. `components/ui/` for shadcn/ui, `components/design/` for design components that expose Action props (e.g., `action`, `submitAction`, `changeAction`) and handle async coordination internally.
- `data/queries/` - Server-side queries wrapped with `cache()`.
- `data/actions/` - Server Actions with `"use server"`.
- Components should live at the nearest shared space in the hierarchy.

## Server Components

- All components are **Server Components by default** - only add `'use client'` when needed.
- Wrap async Server Components in `<Suspense>` with skeleton fallbacks (export skeleton from same file).
- Pass promises (not awaited data) to client components for streaming.
- Add `"use cache"` to pages, components, or functions you want to pre-render or cache.
- Invalidate cache with `revalidateTag()` or `updateTag()` after mutations.

## Client Components

- Use `use()` hook to unwrap promises, wrap in `<Suspense>` with skeleton fallbacks.
- Use `useOptimistic()` for immediate UI feedback during mutations.
- Use `useFormStatus()` in form children to access pending state.
- Use `startTransition` or `useTransition` for pending state, auto error handling, avoiding Suspense fallbacks, and non-blocking updates.
