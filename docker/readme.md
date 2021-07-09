### build docker image
```docker build -t robertfent1/deno-website:v0.x.x -t robertfent1/deno-website:latest -f docker/Dockerfile .```
```docker build -t robertfent1/deno-website:dev -f docker/Dockerfile .```

### run docker image with mongo in compose file
```docker-compose -f docker/docker-compose.yml up```

### run docker image without compose/db
```docker run -it -p 127.0.0.1:8071:8071/tcp robertfent1/deno-website:latest```

### push new image to registry
```docker push robertfent1/deno-website:v0.x.x```
```docker push robertfent1/deno-website:dev```
```docker push robertfent1/deno-website:latest```