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
    echo "Run this script from backend folder"
    echo "pass -d to create/update lock file for external deps"
    echo "pass -t to cache types used in main file"
    echo "pass -r to reload external deps when freshly cloned this repo"
    echo "###########################################################"
fi

DENO_ARGS="-c ./tsconfig.json --unstable"

# check if script is in backend folder
echo "Running script from $PWD"
REGEX=".*\/backend"
if [[ "$PWD" =~ $REGEX ]]; then
    if [ "$DEPS" == "1" ]; then
        deno cache $DENO_ARGS --lock=lock.json --lock-write ./deps.ts
        echo "Wrote external deps into ${PWD}/deps.ts"
    fi
    if [ "$TYPES" == "1" ]; then
        deno cache $DENO_ARGS src/Server.ts
        echo "Cached types used in main file"
    fi
    if [ "$RELOAD" == "1" ]; then
        deno cache $DENO_ARGS --reload --lock=lock.json ./deps.ts
        echo "Reloaded external deps"
    fi
else echo  "Pls run this script from the backend folder"
fi