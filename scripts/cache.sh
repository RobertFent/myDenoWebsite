#!/usr/bin/env bash
# parse args
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -d|--deps) DEPS=1 ;;
        -t|--types) TYPES=1 ;;
        -r|--reload) RELOAD=1 ;;
        -h|--help) USAGE=1 ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# explain usage
if [ "$USAGE" == "1" ]; then
    echo "###########################################################"
    echo "Usage:"
    echo "Run this script from root folder"
    echo "pass -d to create/update lock file for external deps"
    echo "pass -t to cache types used in main file"
    echo "pass -r to reload external deps when freshly cloned this repo"
    echo "###########################################################"
fi

DENO_ARGS="-c backend/tsconfig.json --unstable"

# check if script is in root folder
echo "Running script from $PWD"
REGEX=".*\/(myDenoWebsite|app)"
if [[ "$PWD" =~ $REGEX ]]; then
    if [ "$DEPS" == "1" ]; then
        deno cache $DENO_ARGS --lock=backend/lock.json --lock-write backend/deps.ts
        echo "Wrote deps from ${PWD}/backend/deps.ts into ${PWD}/backend/lock.json "
    fi
    if [ "$TYPES" == "1" ]; then
        deno cache $DENO_ARGS backend/src/Server.ts
        echo "Cached types used in main file"
    fi
    if [ "$RELOAD" == "1" ]; then
        deno cache $DENO_ARGS --reload --lock=backend/lock.json backend/deps.ts
        echo "Reloaded external deps"
    fi
else echo "Pls run this script from the root folder"
fi