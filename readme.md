# Project structure
## Backend
- .vscode: vscode settings
- config: default configuration for project
- lib: type declarations
- src: main server file
- deps.ts: file containing external deps
## Frontend
## Docker
## Scripts
- run launch website to: - launch website in watch mode or not (-w)
                         - reload external deps in cache and check their integrity (-f)
- run cache to: - update lockfile based on current deps (-d)
                - cache types used in main file (-t)
                - reload cached external deps (-r)
- launch for dev: ../scripts/launch_website.sh -w -f
- setup ide: ../scripts/cache -r -t

### setting up website
- launch mongo in docker
```docker-compose up```
- cache deps and launch website from backend folder
```./scripts/cache.sh -r -d```
```./scripts/launch_website.sh -f```

## mongo connection strings
- depending on docker or local db change uri
```
mongodb://admin:admin@my-mongodb:27017
mongodb://admin:admin@localhost:27017
mongodb://admin:admin@{wsl port}:27017
```
- current docker-compose file in root is for using website without deno server in docker
### connect to mongodb with deno not as container:
- get ip of wsl
```
ip addr show eth0 | grep 'inet\b' | awk '{print $2}' | cut -d/ -f1
```
- use ip in connection string
```
mongodb://admin:admin@{ip}:27017
```

## todo
- proper secrets