FROM frolvlad/alpine-glibc

# download deps
RUN apk update && apk add curl && apk add --no-cache bash
RUN curl -fsSL https://deno.land/x/install/install.sh | sh && cp /root/.deno/bin/deno /bin/deno

# The port that your application listens to.
EXPOSE 8080

WORKDIR /app

ADD . .

CMD ["/bin/bash", "scripts/entrypoint.sh"]