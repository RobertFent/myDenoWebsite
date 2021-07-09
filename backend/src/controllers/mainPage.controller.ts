import { generateTimestamp, getCurrentDay, getDayFromCustomTimestamp, getIp, pagesDir } from "../utils/utils.ts";
import { MongoClientWrapper } from "../utils/mongoClientWrapper.ts";
import { PageInformation } from "../utils/constants.ts";
import { Logger } from "../utils/logger.ts";
import { versionTag } from "../Server.ts";

/**
 * visitation counts as new if last visit was not today
 * @param timestamp string from LastVisit cookie
 * @returns {boolean} true if last visit was not today
 */
// deno-lint-ignore no-unused-vars
const newVisitation = (timestamp: string): boolean => {
    if (!timestamp) return true;
    const lastVisitDay = getDayFromCustomTimestamp(timestamp);
    return lastVisitDay !== getCurrentDay();
}

/**
 * RouterContext needs to be any typed because the viewEngine adds the render method
 * and there is no type for the new context
 */
// deno-lint-ignore no-explicit-any
export const getMainPage = async (ctx: any) => {
    await ctx.render(`${pagesDir}/${PageInformation.MainPage.HtmlFile}`, { versionTag: versionTag });

    const ip = getIp(ctx);

    // insert visitor if access to db
    if (MongoClientWrapper.isConnected) {
        // return if visitor already exists
        if (await MongoClientWrapper.getVisitor(ip)) {
            Logger.debug(import.meta.url, `Visitor (${ip}) already exists. No new visitor is created!`);
            return;
        }
        void MongoClientWrapper.insertVisitor(ip, generateTimestamp());
        Logger.info(import.meta.url, `New Visitor is created! ip: ${ip}`);
    } else {
        Logger.info(import.meta.url, 'No connection to db. Could not write visitor to db!');
        Logger.info(import.meta.url, `ip of visitor: ${ip}`);
    }
        

    // use code below if using cookie 'LastVisit'
    /* if (MongoClientWrapper.isConnected) {
        // only insert same visitor once a day
        if (newVisitation(ctx.cookies.get('LastVisit'))) {
            const ip = realIp ? realIp : ctx.request.ip;
            void MongoClientWrapper.insertVisitor(ip, generateTimestamp());
        }   
    } else {
        Logger.info(import.meta.url, 'No connection to db!');
    } */
};