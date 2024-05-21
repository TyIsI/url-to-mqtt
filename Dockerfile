FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack install -g pnpm@9 && corepack enable pnpm

COPY --link . /app

WORKDIR /app

FROM base AS run-base

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base

COPY --from=run-base --link /app/node_modules /app/node_modules

EXPOSE 8000

CMD [ "pnpm", "start" ]
