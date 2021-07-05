### build docker image
```docker build -t robertfent1/deno-website:v0.x.x -f docker/Dockerfile .```

### run docker image with mongo in compose file
```docker-compose -f docker/docker-compose.yml up```

### push new image to registry
```docker push robertfent1/deno-website:v0.x.x```