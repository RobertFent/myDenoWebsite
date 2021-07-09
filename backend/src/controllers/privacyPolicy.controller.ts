import { PageInformation } from "../utils/constants.ts";
import { Logger } from "../utils/logger.ts";
import { pagesDir } from "../utils/utils.ts";

// deno-lint-ignore no-explicit-any
export const getPrivacyPolicy = async (ctx: any) => {
    // Logger.info(import.meta.url, '');
    await ctx.render(`${pagesDir}/${PageInformation.PrivacyPolicy.HtmlFile}`);
}