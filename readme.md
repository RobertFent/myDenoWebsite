# Project structure
## Backend
- .vscode: vscode settings
- config: default configuration for project
- lib: type declarations
- src: - main server file
- deps.ts: file containing external deps
## Frontend
## Docker
## Scripts
- run launch website to: - launch website in watch mode or not
                         - reload external deps in cache and check their integrity
- run cache to: - cache external deps
                - cache types used in main file
                - reload cached external deps
- launch for dev: ../scripts/launch_website.sh -w -f
- setup ide: ../scripts/cache -r -t

### setting up website
- launch mongo in docker
```docker-compose up```
- cache deps and launch website from backend folder
```../scripts/cache.sh -r -d```
```../scripts/launch_website.sh -f```

## currently debugging mongo
- depending on docker or local db change uri
```
mongodb://admin:admin@my-mongodb:27017
mongodb://admin:admin@localhost:27017
```
- current docker-compose file in root is for using website without deno server in docker