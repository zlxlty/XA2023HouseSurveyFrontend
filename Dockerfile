FROM node:18-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
RUN npm i -g pnpm

FROM base AS builder
# Set working directory
WORKDIR /app
COPY . .
RUN ls -a

RUN pnpm install

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpx turbo run build

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]