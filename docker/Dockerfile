FROM denoland/deno:alpine-1.12.0

RUN apk update && apk add --no-cache bash

WORKDIR /app

# let user deno own this app
RUN chown -R deno:deno /app

# Prefer not to run as root
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY backend/deps.ts backend/
COPY backend/tsconfig.json backend/tsconfig.json
RUN deno cache -c backend/tsconfig.json --unstable backend/deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache -c backend/tsconfig.json --unstable backend/src/Server.ts

CMD ["/bin/bash", "scripts/entrypoint.sh"]