# recipeit-frontend

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
certbot --nginx -d test.recipeit.pl -d www.test.recipeit.pl
0 12 * * * /usr/bin/certbot renew --quiet
```
