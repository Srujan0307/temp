# Development stage
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY .eslintrc.js ./
COPY .editorconfig ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY .eslintrc.js ./
COPY .editorconfig ./

RUN npm install -g pnpm

RUN pnpm install --prod

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start"]
