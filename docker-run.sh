#!/bin/bash

PORT=3000
DOCKER_IMAGE_TAG=$1

# for volume
# /tmp/litebb/dbs is in host machine
# /opt/litebb/dbs is inside the container

docker run -it --rm \
    -p "$PORT:$PORT" \
    --env-file .env \
    -e NODE_ENV='production' \
    #-e FIRST_RUN=1 \
    --volume /tmp/litebb/dbs:/opt/litebb/dbs \
    "${DOCKER_IMAGE_TAG}"
