# Build
FROM node:alpine AS build

WORKDIR /app

COPY package.json bun.lockb .

RUN yarn global add bun

RUN bun add -g @angular/cli && \
    bun install --frozen-lockfile

COPY . .
RUN bun run build --configuration=production

# Serve
FROM nginx:stable as serve

COPY --from=build /app/dist/browser /usr/share/nginx/html
COPY --from=build /app/dist/3rdpartylicenses.txt /usr/share/nginx/html

EXPOSE 80