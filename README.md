# recipeit-frontend

## Required files

Cert files:

- fullchain.pem
- privkey.pem

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

## Certbot configuration

### 1. OVH Configuration

Obtain OVH access token from https://api.ovh.com/createToken/. Then create OVH configuration file:

```ini
# app/cert/.secrets/ovh.ini

dns_ovh_endpoint = ovh-eu
dns_ovh_application_key = YOUR_APPLICATION_KEY
dns_ovh_application_secret = YOUR_APPLICATION_SECRET
dns_ovh_consumer_key = YOUR_CONSUMER_KEY
```

### 2. Scripts

Create two bash script files:

Certbot init script:
```sh
docker run \
 --rm \
 --name letsencrypt \
 -v ~/app/cert/.secrets/ovh.ini:/ovh.ini \
 -v ~/app/cert/etc/letsencrypt:/etc/letsencrypt \
 -v ~/app/cert/var/lib/letsencrypt:/var/lib/letsencrypt \
 -v ~/app/cert/var/log/letsencrypt:/var/log/letsencrypt \
 certbot/dns-ovh:latest certonly \
   --non-interactive \
   --agree-tos -m kumalgfilms@gmail.com \
   --dns-ovh \
   --dns-ovh-credentials /ovh.ini \
   --dns-ovh-propagation-seconds 10 \
   -d recipeit.pl -d *.recipeit.pl 
```

Certbot renew script:
```sh
#!/usr/bin/env bash

docker pull certbot/dns-ovh:latest
docker run --rm --name letsencrypt \
  -v ~/app/cert/.secrets/ovh.ini:/ovh.ini \
  -v ~/app/cert/etc/letsencrypt:/etc/letsencrypt \
  -v ~/app/cert/var/lib/letsencrypt:/var/lib/letsencrypt \
  -v ~/app/cert/var/log/letsencrypt:/var/log/letsencrypt \
  certbot/dns-ovh:latest renew \
   --dns-ovh --dns-ovh-credentials /ovh.ini \
   --dns-ovh-propagation-seconds 10
```

Then set proper permissions with
```sh
chmod +x FILE_PATH
```

Now you can run init script. To run renew script automatically, you can use cron:

```
0 0 * * 0 /home/ubuntu/app/src/certbot_renew.sh
```