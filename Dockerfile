FROM cgr.dev/chainguard/node:latest-dev AS base

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# NOTE: We also install dev deps as TypeScript is needed in build
RUN pnpm install

FROM base AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN pnpm build --no-lint

FROM cgr.dev/chainguard/node:latest AS runner
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

# Copy from build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/node_modules ./node_modules

# Run app command
ENTRYPOINT [""]
CMD ["dumb-init", "node", "server.js"]
