FROM oven/bun:1.4.2 AS base
WORKDIR /app

# Copy root and package dependency manifests
COPY package.json bun.lock ./
COPY apps/collab/package.json ./apps/collab/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/emails/package.json ./packages/emails/package.json

RUN bun install --frozen-lockfile

# Copy monorepo packages needed for collab
COPY packages/ ./packages/
COPY apps/collab/ ./apps/collab/

WORKDIR /app/apps/collab

ENV PORT=3002
EXPOSE 3002

CMD ["bun", "run", "start"]
