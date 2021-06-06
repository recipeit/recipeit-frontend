# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
RUN apk add git
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY .browserslistrc .eslintrc.js .sentryclirc babel.config.js jsconfig.json vue.config.js ./
COPY public public
COPY src src
COPY .git .git
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /app/dist
VOLUME /app/dist/static
COPY nginx.conf /etc/nginx/nginx.conf
# COPY .htpasswd /etc/apache2/.htpasswd
COPY .cert/fullchain.pem /etc/letsencrypt/live/recipeit.pl/fullchain.pem
COPY .cert/privkey.pem /etc/letsencrypt/live/recipeit.pl/privkey.pem
CMD ["nginx", "-g", "daemon off;"]
