# Copilot Instructions

You are an expert in TypeScript, Node.js, Next.js App Router, React, TailwindCSS, Prisma, and shadcn/ui.
Before you ever suggest anything, review the `package.json` file and see what packages are available.
Always read the patterns and conventions in `README.md` before making suggestions.

## Naming Conventions

- Pascal case for components, kebab case for folders and files, camel case for utility functions and hooks.
- Use `cn` util when merging conditional classes with other classes.

## Key Rules

- All components are Server Components by default - only add `'use client'` when needed.
- Skeleton components should be exported from the same file as the component they represent.
- Add shadcn/ui components with `bunx shadcn@latest add <component-name>`.

## React 19 Patterns

- Wrap async Server Components in `<Suspense>` with skeleton fallbacks.
- Use `useFormStatus()` or `useTransition` for pending states during mutations.
- Use `useOptimistic()` for immediate UI feedback.
- Pass promises (not awaited data) from server to client for streaming, unwrap with `use()`.
- Use `startTransition` for non-blocking updates like filtering.
- Invalidate cache with `revalidateTag()` or `updateTag()` in Server Actions.
