FROM node:24.15.0-bookworm-slim AS build
WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/validation/package.json packages/validation/package.json
RUN pnpm install --frozen-lockfile
COPY apps/api apps/api
COPY packages/config packages/config
COPY packages/types packages/types
COPY packages/validation packages/validation
RUN pnpm --filter @ember-and-oak/api... build

FROM node:24.15.0-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /workspace
COPY --from=build /workspace /workspace
EXPOSE 4000
CMD ["sh", "-c", "node apps/api/dist/database/migrate.js && node apps/api/dist/content/seed-content.js && node apps/api/dist/main.js"]
