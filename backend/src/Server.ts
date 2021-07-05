import { Application } from "../deps.ts";
import { MongoClientWrapper } from "./utils/mongoClientWrapper.ts";
import router from "./routers/router.ts";
import { cookieUser, errorHandler, requestLogger, staticFileHandler, viewEngineSetter } from "./middlewares/middleware.ts";
import { SERVER_PORT, CONNECTION_STRING, DEFAULT_DB, HOST_NAME, MONGO_ATLAS } from "./utils/constants.ts";
import { dotenv } from './utils/dotenv.parser.ts';
import { Logger } from "./utils/logger.ts";

// init logger
Logger.init();

// server config
const env = dotenv();
const port = parseInt(env.SERVER_PORT) || SERVER_PORT;
const hostname = env.HOST_NAME || HOST_NAME;
const connectionString = env.CONNECTION_STRING || CONNECTION_STRING;
const database = env.DATABASE || DEFAULT_DB;
// without casting to number first value is always true
const usesAtlas = Boolean(Number(env.MONGO_ATLAS)) || MONGO_ATLAS;

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
    app.use(router.allowedMethods());

    // needs to be set after routing to not fuck up other routes than root
    app.use(staticFileHandler);

    // setup listeners
    app.addEventListener("listen", (event) => {
        Logger.startup(import.meta.url, `Server listening on http://${event.hostname}:${event.port}`);
    });

    app.addEventListener('error', (event) => {
        Logger.error(import.meta.url, event.message);
    });

    return app;
};

const initMongo = (): void => {
    void MongoClientWrapper.initMongoClient(connectionString, database, usesAtlas);
};

const run = async (): Promise<void> => {
    try {
        // init stuff
        const app = setupApp();
        initMongo();

        // launch server
        await app.listen({ hostname: hostname, port: port });
    } catch (error) {
        Logger.error(import.meta.url, error);
    }
};

await run();