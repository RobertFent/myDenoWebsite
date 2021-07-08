#!/usr/bin/env bash

# check if script is in root folder
echo "Running script from $PWD"

echo "Launch mode (dev = 0 or prod = 1): $MODE"
# check if mode is set
if [ ! -n "$MODE" ]; then
    echo "mode is unset. Setting it to dev.."
    MODE=0 
    echo "new mode: $MODE"
fi

REGEX=".*\/app"
if [[ "$PWD" =~ $REGEX ]]; then

    # set proper .env
    if [[ "$MODE" == 1 ]]; then
        mv example_envs/.env_mongo_network .env
    else mv example_envs/.env_mongo_network_dev .env
    fi

    # args for caching
    # DENO_ARGS="-c backend/tsconfig.json --unstable"
    # run cache stuff
    # echo "running cache stuff"
    # deno cache $DENO_ARGS --reload --lock=backend/lock.json backend/deps.ts
    # echo "Reloaded external deps"
    # deno cache $DENO_ARGS backend/src/Server.ts
    # echo "Cached types used in main file"
    # echo "cache stuff successfully done"

    # args for launching website
    LAUNCH_ARGS="-c backend/tsconfig.json --unstable --allow-net --allow-env --allow-read --allow-write --allow-plugin"
    # force launch args
    # LAUNCH_ARGS="$LAUNCH_ARGS --lock=backend/lock.json --cached-only"
    LAUNCH_ARGS="$LAUNCH_ARGS"
    # launch website
    echo "launching website..."
    deno run $LAUNCH_ARGS backend/src/Server.ts

else echo "Pls run this script from the root folder"
fi
echo "Exiting..."