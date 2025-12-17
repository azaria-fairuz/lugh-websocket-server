# 1st stage
FROM oven/bun:1 AS builder

WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

#-- 2nd stage
FROM oven/bun:1 AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 8502
CMD ["bun", "run", "src/index.ts"]
