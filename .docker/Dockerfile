ARG USER=node
ARG WORKDIR=/app
ARG LANG=C.UTF-8

FROM cgr.dev/chainguard/node:latest-dev AS builder

ARG USER
ARG WORKDIR
ARG LANG

ENV CI=true LANG=${LANG} NEXT_TELEMETRY_DISABLED=1 NODE_ENV=development

WORKDIR ${WORKDIR}

USER ${USER}

# Copy RC, lockfile and configuration files
COPY --chown=${USER}:${USER} \
  components.json \
  next.config.mjs \
  package.json \
  pnpm-lock.yaml \
  postcss.config.mjs \
  tailwind.config.ts \
  tsconfig.json \
  ${WORKDIR}/

# Copy source code
COPY --chown=${USER}:${USER} src ${WORKDIR}/src

RUN set -euxo pipefail; \
  corepack prepare pnpm --activate;\
  pnpm install --frozen-lockfile; \
  pnpm dlx cross-env NODE_ENV=production pnpm run build;

FROM cgr.dev/chainguard/node:latest AS runner

ARG USER
ARG WORKDIR
ARG LANG

ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

WORKDIR ${WORKDIR}

# next build already produces a node_modules directory ready for production inside .next/standalone
# so we don't need to copy the source code and run pnpm install --prod again
COPY --from=builder --chown=${USER}:${USER} ${WORKDIR}/.next/standalone ${WORKDIR}/
COPY --from=builder --chown=${USER}:${USER} ${WORKDIR}/.next/static ${WORKDIR}/.next/static

EXPOSE 3000

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]

CMD [ "node", "server.js" ]
