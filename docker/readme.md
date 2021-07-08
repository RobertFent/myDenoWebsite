### build docker image
```docker build -t robertfent1/deno-website:v0.x.x -t robertfent1/deno-website:latest -f docker/Dockerfile .```
```docker build -t robertfent1/deno-website:dev -f docker/Dockerfile .```

### run docker image with mongo in compose file
```docker-compose -f docker/docker-compose.yml up```

### push new image to registry
```docker push robertfent1/deno-website:v0.x.x```
```docker push robertfent1/deno-website:dev```
```docker push robertfent1/deno-website:latest```