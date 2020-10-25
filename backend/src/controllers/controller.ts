import { RouterContext, HttpError, Status } from "../../deps.ts";
import { generateTimestamp, staticDir } from "../utils/utils.ts";
import { MongoClientWrapper } from "../utils/mongoClientWrapper.ts";

export const getMainPage = async (ctx: RouterContext) => {
    try {
        await ctx.send({
            root: staticDir,
            index: 'index.html'
        });
    } catch (error) {
        console.log(`Error!: ${error}`);
    }

    if (MongoClientWrapper.isConnected) {
        // todo await vs void
        void MongoClientWrapper.printUsers();
        void MongoClientWrapper.insertUser(ctx.request.ip, generateTimestamp());
    } else {
        console.log('No connection to db!');
    }
};

export const getVisitorsBook = (ctx: RouterContext) => {
    ctx.response.body = "Visitors Book";
};

export const postVisitorEntry = (ctx: RouterContext) => {
};
