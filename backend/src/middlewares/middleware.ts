import { Context, cyan, green, HttpError, Status } from "../../deps.ts";
import { generateTimestamp } from "../utils/utils.ts";

// deno-lint-ignore no-explicit-any
export const errorHandler = async (ctx: Context, next: () => any) => {
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
export const requestLogger = async (ctx: Context, next: () => any) => {
    console.log(`${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)}`);
    await next();
};

// deno-lint-ignore no-explicit-any
export const cookieUser = async (ctx: Context, next: () => any) => {
    const lastVisit = ctx.cookies.get('LastVisit');
    ctx.cookies.set('LastVisit', generateTimestamp())
    if (!lastVisit) console.log(`New user: ${ctx.request.ip}`);
    await next();
}

export const notFound = () => {
    const httpError = new HttpError();
    httpError.status = Status.NotFound;
    throw httpError;
};
