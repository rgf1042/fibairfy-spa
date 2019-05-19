#!/bin/bash
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
export REPO=rgf1042/fibairfy-spa
docker build -t $REPO:$TRAVIS_TAG .
docker push $REPO