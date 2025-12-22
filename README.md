# Next.js Starter

A [Next.js 16](https://nextjs.org/) starter with [Prisma](https://www.prisma.io/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (built on [Base UI](https://base-ui.com/)), and modern patterns for building demos and applications. Includes [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) with [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) for opt-in caching and Partial Pre-Rendering.

## Getting Started

Install dependencies and run the development server:

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Prisma Setup

Initialize the local SQLite database:

```bash
npm run prisma.push
```

Seed initial data:

```bash
npm run prisma.seed
```

View data in Prisma Studio:

```bash
npm run prisma.studio
```

## Project Structure

- `app` - Pages and layouts using [file-based routing](https://nextjs.org/docs/app/building-your-application/routing)
- `components` - Shared components
- `data/actions` - [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) for mutations
- `data/queries` - Server-side data queries with [`cache()`](https://react.dev/reference/react/cache)
- `_components` - Route-local components (prefixed with `_`)

Every page folder should contain everything it needs to work. Every component or function should live at the nearest shared space in the hierarchy.

## Development Tools

The project uses [ESLint](https://eslint.org/) for linting and [Prettier](https://prettier.io/) for code formatting. The configuration is in `eslint.config.mjs` and `.prettierrc`. The project is configured to run code formatting and linting on save in Visual Studio Code. Opening the `.code-workspace` file will ensure the correct extensions are set.

## shadcn/ui Components

UI components are from [shadcn/ui](https://ui.shadcn.com/) built on [Base UI](https://base-ui.com/) in `components/ui/`. Add components with `bunx shadcn@latest add <component-name>`.

## Naming Conventions

- Pascal case for components
- Kebab case for folders and files
- Camel case for utility functions and hooks

## Data Fetching and Mutation

Mutations are done using [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations). Files are stored inside the `data` folder, where `data/queries` are server-side data queries and `data/actions` are mutations. Take extra consideration when creating hidden endpoints with [`"use server"`](https://react.dev/reference/rsc/use-server) to avoid exposing sensitive data.

## Deployment

Build for production:

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) for the easiest experience. Note: Use a production database instead of SQLite.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
