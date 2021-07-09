import { VisitorEntry } from "../models/visitorEntry.d.ts"
import { MongoClientWrapper } from "../utils/mongoClientWrapper.ts"
import { generateTimestamp, getIp, pagesDir } from "../utils/utils.ts";
import { RouterContext } from "../../deps.ts";
import { PageInformation } from "../utils/constants.ts";
import { Logger } from "../utils/logger.ts";
import { versionTag } from "../Server.ts";

const parseVisitorEntry = async (ctx: RouterContext): Promise<VisitorEntry> => {
    const formData = (await (ctx.request.body({type: 'form-data'}).value.read())).fields
    return {
        name: formData.name,
        message: formData.message,
        timestamp: generateTimestamp(),
        ip: getIp(ctx)
    }
}

// deno-lint-ignore no-explicit-any
export const getVisitorsBook = async (ctx: any) => {
    // entries loaded when no db connection is available
    let existingEntries: VisitorEntry[] = [
        { timestamp: generateTimestamp(), name: 'Test User 1', message: 'Test Entry 1', ip: '1.2.3.4'},
        { timestamp: generateTimestamp(), name: 'Test User 2', message: 'Test Entry 2', ip: '1.2.3.5'},
        { timestamp: generateTimestamp(), name: 'Test User 3', message: 'Test Entry 3', ip: '1.2.3.6'}
    ];
    if (MongoClientWrapper.isConnected) {
        existingEntries = await MongoClientWrapper.getVisitorEntries();
    } else {
        Logger.debug(import.meta.url, 'No connection to db! Entries could not be loaded');
    }
    await ctx.render(`${pagesDir}/${PageInformation.VisitorsBook.HtmlFile}`, {entries: existingEntries, versionTag: versionTag});
}

export const postVisitorEntry = async (ctx: RouterContext) => {
    const entry = await parseVisitorEntry(ctx);

    // value which decides of somebody should write in the book
    let ableToWrite = true;

    // check if visitor did more than three entries and set ability to false
    const existingEntriesByIp = await MongoClientWrapper.getVisitorEntriesByIp(entry.ip);
    if ((existingEntriesByIp && existingEntriesByIp.length > 3)) {
        
        Logger.debug(import.meta.url, `Visitor (${entry.ip}) already added three entries!`)
        ableToWrite = false;
    }

    // check if db is connected and set ability to false if not
    if (!MongoClientWrapper.isConnected) {
        Logger.debug(import.meta.url, 'No connection to db! Entry will not be added');
        ableToWrite = false;
    }

    // add entry if everything is ok
    if (ableToWrite) await MongoClientWrapper.insertVisitorEntry(entry);

    // reload site with new entry
    await getVisitorsBook(ctx);
}