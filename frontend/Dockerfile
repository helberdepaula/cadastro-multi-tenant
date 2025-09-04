  # Use a base image with Node.js
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


RUN yarn add sharp --force

COPY . .

# Configurar variáveis para reduzir consumo de memória
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_DISABLE_ESLINT=1
ENV NEXT_DISABLE_TYPECHECK=1

RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]