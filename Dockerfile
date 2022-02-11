# build stage
FROM node:16.13.2-alpine as build-stage
WORKDIR /app
RUN apk add git
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY .browserslistrc .env .eslintrc.js .prettierrc.js .sentryclirc index.html jsconfig.json tsconfig.json vite.config.ts ./
COPY public public
COPY src src
COPY .git .git
RUN pnpm build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /app/dist
VOLUME /app/dist/static
COPY nginx.conf /etc/nginx/nginx.conf
COPY .cert/fullchain.pem /etc/letsencrypt/live/recipeit.pl/fullchain.pem
COPY .cert/privkey.pem /etc/letsencrypt/live/recipeit.pl/privkey.pem
CMD ["nginx", "-g", "daemon off;"]
