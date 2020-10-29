import { VisitorEntry } from "../models/visitorEntry.d.ts"
import { MongoClientWrapper } from "../utils/mongoClientWrapper.ts"
import { generateTimestamp, pagesDir } from "../utils/utils.ts";
import { RouterContext } from "../../deps.ts";
import { PageInformation } from "../utils/constants.ts";

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
    let existingEntries: VisitorEntry[] = [];
    if (MongoClientWrapper.isConnected) {
        existingEntries = await MongoClientWrapper.getVisitorEntries();
    } else {
        console.log('No connection to db! Entries could not be loaded');
    }
    await ctx.render(`${pagesDir}/${PageInformation.VisitorsBook.HtmlFile}`, {entries: existingEntries});
}

// todo error handling?
export const postVisitorEntry = async (ctx: RouterContext) => {
    const entry = await parseVisitorEntry(ctx);
    if (MongoClientWrapper.isConnected) {
        await MongoClientWrapper.insertVisitorEntry(entry);
    } else {
        console.log('No connection to db! Entry could not be added')
    }
    // reload site with new entry
    await getVisitorsBook(ctx);
}