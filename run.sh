#!/bin/bash
. ./config.sh
docker run  --privileged=true --rm -it -v $PWD:/src -p $PORT:3000 --name kearney-dev kearney npm run dev-run