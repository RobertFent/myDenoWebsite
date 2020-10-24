import { RouterContext } from "../../deps.ts";
import { generateTimestamp } from "../utils/utils.ts";
import { MongoClientWrapper } from "./mongoClientWrapper.ts";

export const getMainPage = (ctx: RouterContext) => {
    ctx.response.body = 'Hello from Deno!'
    // todo await vs void
    void MongoClientWrapper.printUsers();
    void MongoClientWrapper.insertUser(ctx.request.ip, generateTimestamp());
};

export const getVisitorsBook = (ctx: RouterContext) => {
    ctx.response.body = 'Visitors Book'
};

export const postVisitorEntry = (ctx: RouterContext) => {

};
