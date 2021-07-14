#!/usr/bin/env bash

mv example_envs/.env_docker_ci .env

# args for caching
DENO_ARGS="-c backend/tsconfig.json --unstable"
# run cache stuff
echo "running cache stuff"
# deno cache $DENO_ARGS --reload --lock=backend/lock.json backend/deps.ts
# echo "Reloaded external deps"
deno cache $DENO_ARGS backend/deps.ts
echo "Cached types used in main file"


 # args for launching website
LAUNCH_ARGS="-c backend/tsconfig.json --unstable --allow-net --allow-env --allow-read --allow-write --allow-plugin"
# force launch args
# LAUNCH_ARGS="$LAUNCH_ARGS --lock=backend/lock.json --cached-only"
LAUNCH_ARGS="$LAUNCH_ARGS"
# launch website
echo "launching website..."

# launch website as detached process
deno run $LAUNCH_ARGS backend/src/Server.ts &

# wait 10 secs for website start
echo 'waiting 10 secs for server startup'
sleep 10

# run tests
echo 'launching tests'
deno test -A --unstable