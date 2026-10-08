# Baretext

**Baretext** is a simple place to write, organize, and revisit your notes. Easy to get started with, comfortable to use every day.

- **Web:** [baretext.app](https://baretext.app)
- **Repository:** [github.com/anuj-kuralkar/baretext](https://github.com/anuj-kuralkar/baretext)

## Architecture

Baretext is a Bun workspace monorepo consisting of:
- `apps/web`: Next.js frontend with a Lexical (Yjs) rich text editor.
- `apps/api`: ElysiaJS backend.
- `packages/*`: Shared internal packages.

### Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, Base UI, shadcn/ui, Lucide React.
- **Backend**: ElysiaJS.
- **Database & ORM**: Neon (Serverless Postgres), Drizzle ORM.
- **Data Sync & Offline**: ElectricSQL, TanStack DB.
- **Cache**: Upstash Redis.
- **Authentication**: Better Auth.
- **Validation**: Zod.
- **Tooling**: Bun, Biome, Vitest.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development setup, environment variables, and code quality guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
