### todo
- add linting rules
- maybe use import map when this feature is stable
- path resolution in bash scripts (for now run them from backend folder)

### scripts
- launch website for dev: ../scripts/launch_website.sh -w -f
- setup ide: ../scripts/cache -d -t -r

### useful built in deno tools:
- deno help | upgrade
- deno info {filename} to get deps
- if not using vscode: https://www.sitepoint.com/deno-built-in-tools/

### caching and lock files workflow
- run ../scripts/cache.sh -r to reload cached external deps
- run ../scripts/cache.sh -d to write external deps and its version into lock file
- push created lock.json file