import { Application } from "../deps.ts";
import { MongoClientWrapper } from "./utils/mongoClientWrapper.ts";
import router from "./routers/router.ts";
import { errorHandler, requestLogger, staticFileHandler, viewEngineSetter } from "./middlewares/middleware.ts";
import { SERVER_PORT, CONNECTION_STRING, DEFAULT_DB, HOST_NAME, DEFAULT_LOG_LEVEL, VERSION_TAG } from "./utils/constants.ts";
import { dotenv } from './utils/dotenv.parser.ts';
import { Logger, LogLevel } from "./utils/logger.ts";

// server config
const env = dotenv();
const port = parseInt(env.SERVER_PORT) || SERVER_PORT;
const hostname = env.HOST_NAME || HOST_NAME;
const connectionString = env.CONNECTION_STRING || CONNECTION_STRING;
const database = env.DATABASE || DEFAULT_DB;
// deno-lint-ignore no-explicit-any
const logLevel = LogLevel[env.LOG_LEVEL as any] as unknown as LogLevel || DEFAULT_LOG_LEVEL;

// export this const to use it in controller
export let versionTag = env.VERSION || VERSION_TAG;
// append tag if exists
if (env.TAG && env.TAG != 'latest') versionTag += `-${env.TAG}`;


// deno-lint-ignore no-explicit-any
const setupApp = (): Application<Record<string, any>> => {
    const app = new Application({
        // This will be used to sign cookies to help prevent cookie tampering
        keys: ['secret1']
    });

    // setup middleware
    app.use(errorHandler);
    app.use(requestLogger);

    // disable cookies for now
    // app.use(cookieUser);

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
    void MongoClientWrapper.initMongoClient(connectionString, database);
};

/*
*   this function logs the mem usage every 10 minutes
*
*   rss: resident set size -> amount of space occupied in main memory device (process memory held in RAM)
*   heapTotal: size of allocated total heap
*   heapUsed: size of heap that is actually used
*   external: memory usage of C++ objects bound to JS objects managed by V()
*/
// deno-lint-ignore no-unused-vars
const logMemoryUsage = (): void => {
    void setInterval(() => {
        const memUsage = Deno.memoryUsage();
        Object.keys(memUsage).forEach((type, bytes) => {
            // convert bytes to MiB
            memUsage[type as keyof Deno.MemoryUsage] = bytes * 9,5367e-7
        });
        Logger.debug(import.meta.url, `Memory usage in MiB: ${JSON.stringify(memUsage)}`);
    // log mem usage every 10 minutes
    }, 600000);
}

export const run = async (): Promise<void> => {
    try {
        // init logger
        Logger.init(logLevel);
        Logger.startup(import.meta.url, `Current version: ${versionTag}`);

        // start mem usage logger
        // logMemoryUsage();

        // init application
        const app = setupApp();
        initMongo();

        // launch server
        await app.listen({ hostname: hostname, port: port });
    } catch (error) {
        Logger.error(import.meta.url, error);
    }
};

await run();