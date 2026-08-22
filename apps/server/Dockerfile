FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/game-engine/package.json ./packages/game-engine/
COPY apps/server/package.json ./apps/server/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter server db:generate && pnpm --filter server build

EXPOSE 3001

CMD ["node", "apps/server/dist/index.js"]
