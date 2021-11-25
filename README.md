# recipeit-frontend

## Required files

Cert files:

- .cert/fullchain.pem
- .cert/privkey.pem

Sentry:

- .sentryclirc

## Project setup

```sh
yarn install
```

### Compiles and hot-reloads for development

```sh
yarn serve
```

### Compiles and minifies for production

```sh
yarn build
```

### Lints and fixes files

```sh
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Some commands for CertBot

```sh
apk add certbot certbot-nginx
mkdir /etc/letsencrypt
certbot --nginx -d recipeit.pl -d www.recipeit.pl
certbot -d *.recipeit.pl -d recipeit.pl --manual --preferred-challenges dns certonly
0 12 * * * /usr/bin/certbot renew --quiet
```
