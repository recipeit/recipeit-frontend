#!/bin/bash
set -e
set -o pipefail

git \
  -C app/src/recipeit-frontend \
  pull

docker-compose \
  -f app/src/docker-compose.yml \
  up \
  --build \
  -d \
  frontend

echo "Finished deployment"
