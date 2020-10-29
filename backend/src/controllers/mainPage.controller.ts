import { generateTimestamp, getCurrentDay, getDayFromCustomTimestamp, pagesDir } from "../utils/utils.ts";
import { MongoClientWrapper } from "../utils/mongoClientWrapper.ts";
import { PageInformation } from "../utils/constants.ts";

/**
 * visitation counts as new if last visit was not today
 * @param timestamp string from LastVisit cookie
 * @returns {boolean} true if last visit was not today
 */
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
    await ctx.render(`${pagesDir}/${PageInformation.MainPage.HtmlFile}`);
    if (MongoClientWrapper.isConnected) {
        // only insert same visitor once a day
        if (newVisitation(ctx.cookies.get('LastVisit'))) {
            // todo await vs void
            void MongoClientWrapper.insertVisitor(ctx.request.ip, generateTimestamp());
        }
    } else {
        console.log('No connection to db!');
    }
};