#-- 1st stage
FROM oven/bun:1.1.38 AS builder

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

#-- 2nd stage
FROM oven/bun:1.1.38-slim AS runtime

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 8502
CMD ["bun", "run", "server.ts"]
