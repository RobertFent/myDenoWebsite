import { adapterFactory, Context, cyan, engineFactory, green, HttpError, send, Status, viewEngine } from "../../deps.ts";
import { generateTimestamp, pagesDir, staticDir } from "../utils/utils.ts";

// deno-lint-ignore no-explicit-any
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

// deno-lint-ignore no-explicit-any
export const requestLogger = async (ctx: Context, next: () => any): Promise<void> => {
    console.log(`${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)}`);
    await next();
};

// deno-lint-ignore no-explicit-any
export const cookieUser = async (ctx: Context, next: () => any): Promise<void> => {
    const lastVisit = ctx.cookies.get('LastVisit');
    ctx.cookies.set('LastVisit', generateTimestamp())
    if (!lastVisit) console.log(`New user: ${ctx.request.ip}`);
    await next();
}

// Allowing Static file to fetch from server
// deno-lint-ignore no-explicit-any
export const staticFileHandler = async (ctx: Context, next: () => any): Promise<void> => {
    await send(ctx, ctx.request.url.pathname, {
        root: staticDir
    });
    next();
}

// Passing view-engine as middleware
// deno-lint-ignore no-explicit-any
export const viewEngineSetter = (): any => {
    const ejsEngine = engineFactory.getEjsEngine();
    const oakAdapter = adapterFactory.getOakAdapter();
    return viewEngine(oakAdapter, ejsEngine);
}

export const notFound = (): HttpError => {
    const httpError = new HttpError();
    httpError.status = Status.NotFound;
    throw httpError;
};
