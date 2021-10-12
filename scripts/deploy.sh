#!/bin/bash
set -e
set -o pipefail

# Checkout main before pull
git \
  -C app/src/recipeit-frontend \
  checkout main

# Pull changes
git \
  -C app/src/recipeit-frontend \
  pull

# Switch to branch/tag being built
git \
  -C app/src/recipeit-frontend \
  checkout "${GITHUB_BRANCH:-$GITHUB_SHA}"

docker-compose \
  -f app/src/docker-compose.yml \
  up \
  --build \
  -d \
  frontend

echo "Finished deployment"
