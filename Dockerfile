# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
# todo: add yarn.lock here
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /app/dist
COPY nginx.conf /etc/nginx/nginx.conf
COPY .cert/fullchain.pem /etc/letsencrypt/live/test.recipeit.pl/fullchain.pem
COPY .cert/privkey.pem /etc/letsencrypt/live/test.recipeit.pl/privkey.pem
CMD ["nginx", "-g", "daemon off;"]
