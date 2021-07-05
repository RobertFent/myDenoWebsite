#!/usr/bin/env bash

# parse args
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -p|--production) PRODUCTION=1 ;;
        -d|--develop) DEVELOP=1 ;;
        -k|--kill) KILL=1 ;;
        -h|--help) USAGE=1 ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

if [ "$USAGE" == "1" ]; then
    echo "###########################################################"
    echo "usage:"
    echo "run this script from root folder"
    echo "pass -p to run setup for production"
    echo "production: db already setup in docker network, server running in docker"
    echo "pass -d to run setup for develop (db in docker, install, launch in watch mode)"
    echo "develop: launch db in docker, run server locally"
    echo "pass -k to kill db and server after setup"
    echo "###########################################################"
fi

function kill_docker() {
    docker-compose -f docker/docker-compose_db.yml down
    # check if docker stops logging after shutting down
    MONGO_DOWN=$(docker-compose -f docker/docker-compose_db.yml logs | grep my-mongodb)
    if [[ -z "$MONGO_DOWN" ]]; then
        echo "mongo db killed in docker"
    else echo "mongo could not be killed in docker"
    fi
}

REGEX=".*\/(myDenoWebsite|app)"
if [[ "$PWD" =~ $REGEX ]]; then

    if [ "$KILL" == "1" ]; then
    trap ctrl_c INT

    # trap ctrl+c event
    function ctrl_c() {
        kill_docker
        exit
    }
    fi

    if [ "$DEVELOP" == "1" ]; then
        echo "running setup in develop mode"

        # docker
        echo "launching mongo in docker..."
        docker-compose -f docker/docker-compose_db.yml up -d
        # check if docker logs somethings
        MONGO_RUNNING=$(docker-compose -f docker/docker-compose_db.yml logs | grep my-mongodb)
        if [[ ! -z "$MONGO_RUNNING" ]]; then
            echo "mongo is currently launching in docker"
        else echo "mongo could not be launched in docker"
        fi

        # website
        scripts/cache.sh -r -t
        scripts/launch_website.sh -f -w
    fi

    if [ "$PRODUCTION" == "1" ]; then
        echo 'todo'
    fi

    # todo remove
    if [ "$KILL" == "1" ]; then
        echo "killing setup"
        kill_docker
    fi

else echo "Pls run this script from the root folder"
fi 