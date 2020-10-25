#! /bin/sh

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
    echo "Run this script from backend folder"
    echo "pass -w to run server in watch mode"
    echo "pass -f to validate locked modules integrity and cache new deps"
    echo "###############################################################"
fi

# todo only launch without -h as arg

# default params
DENO_ARGS="-c ./tsconfig.json --allow-net --allow-env --allow-read --allow-write --allow-plugin"

# add params to deno
if [ "$FORCE" == "1" ]; then
    DENO_ARGS="$DENO_ARGS --lock=lock.json --cached-only"
fi
if [ "$WATCH" == "1" ]; then
    DENO_ARGS="$DENO_ARGS --unstable --watch"
fi
# echo "$DENO_ARGS"

# check if script is in backend folder
REGEX=".*\/backend"
if [[ "$PWD" =~ $REGEX ]]; then
    deno run $DENO_ARGS src/Server.ts
else echo "Pls run this script from the backend folder"
fi
echo "Exiting..."