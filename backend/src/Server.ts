import { serve, greetings } from '../deps.ts'

// server config
const port = 8080;
const server = serve({ port });
console.log(`Listening on http://localhost:${port}`);
for await (const request of server) {
    request.respond({body: greetings('Deno')});
}

/* for await (const req of server) {
    
} */