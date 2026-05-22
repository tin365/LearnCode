# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# Build context: repo root (so the pnpm workspace is visible).
# Build:  docker build -f apps/api/Dockerfile -t learncode-api .
# Run:    docker run --rm -p 3001:3001 --env-file .env learncode-api
# ---------------------------------------------------------------------------

FROM node:22-slim AS base
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
# Interpreters/compilers used by testRunner.ts to grade submissions:
#   python3              — Python problems (interpreter)
#   default-jdk-headless — Java problems (javac + java)
#   rustc                — Rust problems (apt's rustc, no rustup)
# JavaScript runs via the already-present `node`. Apt's rustc is older
# than rustup but lighter and matches Debian's update cadence; the
# learner programs are small enough not to need the bleeding edge.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      openssl ca-certificates dumb-init \
      python3 \
      default-jdk-headless \
      rustc \
 && rm -rf /var/lib/apt/lists/* \
 && corepack enable \
 && corepack prepare pnpm@9.14.2 --activate

# ---- Install workspace deps (cached on lockfile + manifests) ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/validators/package.json ./packages/validators/
COPY prisma ./prisma
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm config set store-dir /pnpm-store \
 && pnpm install --frozen-lockfile

# ---- Generate Prisma client for the container's libc/openssl ----
FROM deps AS build
WORKDIR /app
COPY apps/api ./apps/api
COPY packages ./packages
# Run from /app so Prisma finds prisma/schema.prisma at its default
# relative path. Running from apps/api/ would force a --schema arg.
RUN pnpm exec prisma generate

# ---- Runtime image ----
FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 3001
ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "--filter", "@learncode/api", "start"]
