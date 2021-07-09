import { VisitorEntry } from "../models/visitorEntry.d.ts"
import { MongoClientWrapper } from "../utils/mongoClientWrapper.ts"
import { generateTimestamp, pagesDir } from "../utils/utils.ts";
import { RouterContext } from "../../deps.ts";
import { PageInformation } from "../utils/constants.ts";
import { Logger } from "../utils/logger.ts";
import { versionTag } from "../Server.ts";

const parseVisitorEntry = async (ctx: RouterContext): Promise<VisitorEntry> => {
    const formData = (await (ctx.request.body({type: 'form-data'}).value.read())).fields
    return {
        name: formData.name,
        message: formData.message,
        timestamp: generateTimestamp()
    }
}

// deno-lint-ignore no-explicit-any
export const getVisitorsBook = async (ctx: any) => {
    // entries loaded when no db connection is available
    let existingEntries: VisitorEntry[] = [
        { timestamp: generateTimestamp(), name: 'Test User 1', message: 'Test Entry 1'},
        { timestamp: generateTimestamp(), name: 'Test User 2', message: 'Test Entry 2'},
        { timestamp: generateTimestamp(), name: 'Test User 3', message: 'Test Entry 3'}
    ];
    if (MongoClientWrapper.isConnected) {
        existingEntries = await MongoClientWrapper.getVisitorEntries();
    } else {
        Logger.debug(import.meta.url, 'No connection to db! Entries could not be loaded');
    }
    await ctx.render(`${pagesDir}/${PageInformation.VisitorsBook.HtmlFile}`, {entries: existingEntries, versionTag: versionTag});
}

// todo error handling?
export const postVisitorEntry = async (ctx: RouterContext) => {
    const entry = await parseVisitorEntry(ctx);
    if (MongoClientWrapper.isConnected) {
        await MongoClientWrapper.insertVisitorEntry(entry);
    } else {
        Logger.debug(import.meta.url, 'No connection to db! Entry could not be added');
    }
    // reload site with new entry
    await getVisitorsBook(ctx);
}