FROM node:alpine AS build

WORKDIR /app

COPY . /app

RUN yarn global add @angular/cli

RUN yarn install --frozen-lockfile

RUN yarn build --configuration=production

#COPY ./www/3rdpartylicenses.txt /app/www/browser/3rdpartylicenses.txt

FROM nginx:stable

COPY --from=build /app/www/browser /usr/share/nginx/html

EXPOSE 80