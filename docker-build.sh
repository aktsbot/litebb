#!/bin/sh

LITEBB_VERSION=$(node -p -e "require('./package.json').version")
GIT_COMMIT=$(git log --format="%h" -n 1)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

TAG="litebb:v${LITEBB_VERSION}_${GIT_BRANCH}_${GIT_COMMIT}"

docker build -t $TAG .

