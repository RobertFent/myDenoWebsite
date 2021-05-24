### todo
- website currently only running when mongo is connected
- add proper http errors instead of 404
- add linting rules
- path resolution in bash scripts (for now run them from backend folder)
- use own mongo client to prevent using permissions (maybe)
- maybe use import map when this feature is stable

### scripts
- launch website for dev: ../scripts/launch_website.sh -w -f
- setup ide: ../scripts/cache -r -t

### useful built in deno tools:
- deno help | upgrade
- deno info {filename} to get deps
- if not using vscode: https://www.sitepoint.com/deno-built-in-tools/

### caching and lock files workflow
#### adding new import
- run ../scripts/cache.sh -t to get types
#### checking out new changes in repo
- run ../scripts/cache.sh -r to reload cached external deps
- run ../scripts/cache.sh -d to write external deps and its version into lock file
- push created lock.json file
#### pulling changes / fresh install
- run ../scripts/cache.sh -r -t to reload cached external deps and get types