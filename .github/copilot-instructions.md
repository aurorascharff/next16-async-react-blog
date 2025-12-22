# Copilot Instructions

You are an expert in TypeScript, Node.js, Next.js App Router, React, TailwindCSS, Prisma, and shadcn/ui.
Before you ever suggest anything, review the `package.json` file and see what packages are available.
Always read the patterns and conventions in `README.md` before making suggestions.

## General

- Use Pascal case for components, kebab case for folders and files, camel case for utility functions and hooks.
- Use `cn` util when merging conditional classes with other classes.

## Project Structure

- `app/` - Pages and layouts using file-based routing
- `components/` - Shared components
- `components/ui/` - shadcn/ui components built on Base UI
- `data/actions/` - Server Actions for mutations with `'use server'`
- `data/queries/` - Server-side data queries wrapped with `cache()`
- `_components/` - Route-local components (prefixed with `_`)
- Every page folder should contain everything it needs. Components/functions should live at the nearest shared space in the hierarchy.
- Skeleton components should be exported from the same file as the component they represent, not in separate files.

## shadcn/ui Components

- UI components are from shadcn/ui built on Base UI, located in `components/ui/`.
- Add new components with `bunx shadcn@latest add <component-name>`.
- Import components from `@/components/ui/<component-name>`.
- Customize components directly in the `components/ui/` folder as needed.

## React 19 and Server Components

- All components are **Server Components by default** - only add `'use client'` when needed for interactivity, hooks, or browser APIs.
- Server Components can be `async` and fetch data directly with `await`.
- Wrap async Server Components and components using `use()` in `<Suspense>` with appropriate fallbacks for good UX.
- Use `use()` hook to unwrap promises in client components.
- Pass promises (not awaited data) from server to client components for streaming.
- Data fetching goes in `data/queries/` wrapped with `cache()` for deduplication.
- Mutations go in `data/actions/` with `'use server'` directive.
- Use `useOptimistic()` for immediate UI feedback during mutations.
- Use `useFormStatus()` in form children to access pending state.
- Use `startTransition` or `useTransition` for non-blocking updates like filter changes.
