import { Application, bold, yellow, viewEngine, engineFactory, adapterFactory, send } from "../deps.ts";
import { MongoClientWrapper } from "./utils/mongoClientWrapper.ts";
import router from "./routers/router.ts";
import { cookieUser, errorHandler, notFound, requestLogger } from "./middlewares/middleware.ts";
import { staticDir } from "./utils/utils.ts";

// server config
const port = 8080;
const hostname = "127.0.0.1";

// deno-lint-ignore no-explicit-any
const setupApp = (): Application<Record<string, any>> => {
    const app = new Application({
        // This will be used to sign cookies to help prevent cookie tampering
        keys: ['secret1']
    });

    // setup middleware
    app.use(errorHandler);
    app.use(requestLogger);
    app.use(cookieUser);

    // init routes and its methods
    app.use(router.routes());
    // todo get 405, 501 instead of 404
    app.use(router.allowedMethods());

    const denjuckEngine = engineFactory.getDenjuckEngine();
    const oakAdapter = adapterFactory.getOakAdapter();

    // Allowing Static file to fetch from server
    app.use(async (ctx, next) => {
        await send(ctx, ctx.request.url.pathname, {
            root: staticDir
        })
        next()
    });

    // Passing view-engine as middleware
    app.use(viewEngine(oakAdapter, denjuckEngine));

    // used when no route matches
    // app.use(notFound);

    // setup listener
    app.addEventListener("listen", (event) => {
        console.log(
            bold("Start listening on ") +
            yellow(`http://${event.hostname}:${event.port}`),
        );
    });

    return app;
};

const initMongo = async (): Promise<void> => {
    MongoClientWrapper.initMongoClient(
        "mongodb://admin:admin@localhost:27017",
        "test",
    );
    await MongoClientWrapper.insertUser("1", "1");
    await MongoClientWrapper.printUsers();
};

const run = async (): Promise<void> => {
    try {
        // init stuff
        const app = setupApp();
        // await initMongo();

        // launch server
        await app.listen({ hostname: hostname, port: port });
    } catch (error) {
        console.log(error);
    }
};

await run();

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
