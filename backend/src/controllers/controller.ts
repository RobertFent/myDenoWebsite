import { RouterContext, HttpError, Status } from "../../deps.ts";
import { generateTimestamp, pagesDir, staticDir } from "../utils/utils.ts";
import { MongoClientWrapper } from "../utils/mongoClientWrapper.ts";

// deno-lint-ignore no-explicit-any
export const getMainPage = async (ctx: any) => {
    await ctx.render(`${pagesDir}/index.ejs`);
    if (MongoClientWrapper.isConnected) {
        // todo await vs void
        void MongoClientWrapper.printUsers();
        void MongoClientWrapper.insertUser(ctx.request.ip, generateTimestamp());
    } else {
        console.log('No connection to db!');
    }
};

// deno-lint-ignore no-explicit-any
export const getVisitorsBook = async (ctx: any) => {
    await ctx.render(`${pagesDir}/visitors_book.ejs`)
};

export const postVisitorEntry = (ctx: RouterContext) => {
};
