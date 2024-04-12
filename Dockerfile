FROM node:alpine AS build

WORKDIR /app

COPY . /app

RUN yarn global add @angular/cli --network-timeout 1000000

RUN yarn install --frozen-lockfile --network-timeout 1000000

RUN yarn build --configuration=production

#COPY /app/dist/3rdpartylicenses.txt /app/dist/browser/3rdpartylicenses.txt

FROM nginx:stable

COPY --from=build /app/dist/browser /usr/share/nginx/html

EXPOSE 80