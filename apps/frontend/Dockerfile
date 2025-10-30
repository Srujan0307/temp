# Frontend development Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --filter frontend... --frozen-lockfile

COPY . .

RUN pnpm --filter frontend build

EXPOSE 5173

CMD ["pnpm", "--filter", "frontend", "dev", "--", "--host", "0.0.0.0"]
