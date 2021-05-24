import { Application } from "../deps.ts";
import { MongoClientWrapper } from "./utils/mongoClientWrapper.ts";
import router from "./routers/router.ts";
import { cookieUser, errorHandler, notFound, requestLogger, staticFileHandler, viewEngineSetter } from "./middlewares/middleware.ts";
import { SERVER_PORT, CONNECTION_STRING, DEFAULT_DB, HOST_NAME } from "./utils/constants.ts";
import { dotenv } from './utils/dotenv.parser.ts';
import { Logger } from "./utils/logger.ts";

// server config
const env = dotenv();
const port = parseInt(env.SERVER_PORT) || SERVER_PORT;
const hostname = env.HOST_NAME || HOST_NAME;
const connectionString = env.CONNECTION_STRING || CONNECTION_STRING;
const database = env.DATABASE || DEFAULT_DB;

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

    app.use(viewEngineSetter());
    
    // init routes and its methods
    app.use(router.routes());
    // todo get 405, 501 instead of 404
    app.use(router.allowedMethods());

    // needs to be set after routing to not fuck up other routes than root
    app.use(staticFileHandler);

    // todo getting images returns 404 if this middleware is active
    // used when no route matches
    // app.use(notFound);

    // setup listeners
    app.addEventListener("listen", (event) => {
        Logger.info(import.meta.url, `Server listening on http://localhost:${port}`);
    });

    app.addEventListener('error', (event) => {
        Logger.error(import.meta.url, event.message);
    });

    return app;
};

const initMongo = (): void => {
    void MongoClientWrapper.initMongoClient(connectionString, database);
};

const run = async (): Promise<void> => {
    try {
        // init stuff
        const app = setupApp();
        // todo server not working if mongo has no connection
        initMongo();

        // launch server
        await app.listen({ hostname: hostname, port: port });
    } catch (error) {
        Logger.error(import.meta.url, error);
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
