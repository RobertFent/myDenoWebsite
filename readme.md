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
- setup ide: ../scripts/cache -d -t -r
