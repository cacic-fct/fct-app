# Build
FROM node:alpine AS build

WORKDIR /app

COPY package.json yarn.lock .

RUN yarn global add @angular/cli --network-timeout 1000000 && \
    yarn install --frozen-lockfile --network-timeout 1000000

COPY . .
RUN yarn build --configuration=production

# Serve
FROM nginx:stable as serve

COPY --from=build /app/dist/browser /usr/share/nginx/html
COPY --from=build /app/dist/3rdpartylicenses.txt /usr/share/nginx/html

EXPOSE 80