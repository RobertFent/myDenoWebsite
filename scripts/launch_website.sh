#!/usr/bin/env bash

# parse args
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -w|--watch) WATCH=1 ;;
        -f|--force) FORCE=1 ;;
        -h|--help) USAGE=1 ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# explain usage
if [ "$USAGE" == "1" ]; then
    echo "###############################################################"
    echo "Usage:"
    echo "Run this script from root folder"
    echo "pass -w to run server in watch mode"
    echo "pass -f to validate locked modules integrity and cache new deps"
    echo "###############################################################"
fi

# todo only launch without -h as arg

# default params
DENO_ARGS="-c backend/tsconfig.json --unstable --allow-net --allow-env --allow-read --allow-write"

# add params to deno
if [ "$FORCE" == "1" ]; then
    DENO_ARGS="$DENO_ARGS --lock=backend/lock.json --cached-only"
fi
if [ "$WATCH" == "1" ]; then
    DENO_ARGS="$DENO_ARGS --watch"
fi
# echo "$DENO_ARGS"

# check if script is in root folder
echo "Running script from $PWD"
REGEX=".*\/myDenoWebsite"
if [[ "$PWD" =~ $REGEX ]]; then
    deno run $DENO_ARGS backend/src/Server.ts
else echo "Pls run this script from the root folder"
fi
echo "Exiting..."