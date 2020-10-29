// deno-lint-ignore-file no-explicit-any
import { adapterFactory, Context, cyan, engineFactory, green, HttpError, send, Status, viewEngine } from "../../deps.ts";
import { generateTimestamp, staticDir } from "../utils/utils.ts";

/**
 * catches error if thrown in later middleware functions
 * to catch every possible error -> use this handler as first middleware
 * @param ctx current server context
 * @param next next middleware function in queue
 * @module middleware
 */
export const errorHandler = async (ctx: Context, next: () => any): Promise<void> => {
    try {
        await next();
    } catch (error) {
        if (error instanceof HttpError) {
            switch (error.status) {
                case Status.NotFound:
                    console.log(`Route not implemented: ${ctx.request.url}`);
                    ctx.response.body = "404 - Not Found";
                    break;
                default:
                    console.log(`Http error: ${error.message}`);
                    ctx.response.body = error.message;
                    break;
            }
            ctx.response.status = error.status;
        } else {
            ctx.response.body = "Internal Server Error";
            ctx.response.status = Status.InternalServerError;
            console.log(`Server error: ${error}`);
        }
    }
};

/**
 * logs requests to server
 * @param ctx current server context
 * @param next next middleware function in queue
 * @module middleware
 */
export const requestLogger = async (ctx: Context, next: () => any): Promise<void> => {
    const path = ctx.request.url.pathname;
    const regexUnwantedPaths = /\/(assets|js|favicon)\/.*/g;
    // only prints paths without assets|js|favicon at the beginning
    if (!path.match(regexUnwantedPaths)) {
        console.log(`${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)}`);
    }
    await next();
};

/**
 * sets timestamp in a cookie
 * @param ctx current server context
 * @param next next middleware function in queue
 * @module middleware
 */
export const cookieUser = async (ctx: Context, next: () => any): Promise<void> => {
    const lastVisit = ctx.cookies.get('LastVisit');
    ctx.cookies.set('LastVisit', generateTimestamp())
    if (!lastVisit) console.log(`New user: ${ctx.request.ip}`);
    await next();
}

/**
 * Allowing server to fetch static files
 * @param ctx current server context
 * @param next next middleware function in queue
 * @module middleware
 */
export const staticFileHandler = async (ctx: Context, next: () => any): Promise<void> => {
    await send(ctx, ctx.request.url.pathname, {
        root: staticDir
    });
    next();
}

/**
 * Passing view-engine as middleware
 * @module middleware
 */
export const viewEngineSetter = (): any => {
    const ejsEngine = engineFactory.getEjsEngine();
    const oakAdapter = adapterFactory.getOakAdapter();
    return viewEngine(oakAdapter, ejsEngine);
}

/**
 * function throws a 404 error
 * @module middleware
 * @throws {HttpError}
 */
export const notFound = (): HttpError => {
    const httpError = new HttpError();
    httpError.status = Status.NotFound;
    throw httpError;
};
