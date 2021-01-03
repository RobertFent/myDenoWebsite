FROM hayd/alpine-deno:1.6.2

# install bash for later scripts
RUN apk add --update bash && rm -rf /var/cache/apk/*

# The port that your application listens to.
EXPOSE 8080

WORKDIR /myDenoWebsite

# Cache the dependencies as a layer (the following steps before ADD are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files
COPY backend/deps.ts backend/
COPY backend/lock.json backend/
COPY backend/tsconfig.json backend/
COPY scripts/cache.sh scripts/
RUN scripts/cache.sh -r

# These steps will be re-run upon each file change in your working directory:
ADD . .

# Prefer not to run as root.
# USER deno

CMD ["scripts/launch_website.sh", "-f"]