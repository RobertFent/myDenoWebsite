import { Application, /* , serve */ } from "../deps.ts";
import { MongoClientWrapper } from "./services/mongoClientWrapper.ts";
import router from "./services/router.ts";

// server config
const port = 8080;

// todo? write server without deps like oak
/* const server = serve({ port: port });

// main loop of the server
for await (const req of server) {
  const path = req.url;
  const method = req.method;
  const buf = await Deno.readAll(req.body);
  // console.log(`Path: ${path}, Method: ${method}, Body: ${JSON.stringify(body)}`);
  req.respond({ body: greetings("Deno") });
} */

const app = new Application();

// init routes and its methods
app.use(router.routes());
app.use(router.allowedMethods())

// init mongo
MongoClientWrapper.initMongoClient('mongodb://admin:admin@localhost:27017', 'test');
await MongoClientWrapper.insertUser('1', '1');
await MongoClientWrapper.printUsers();

console.log(`Listening on http://localhost:${port}`);
await app.listen({ port });
