import { versionTag } from "../Server.ts";
import { PageInformation } from "../utils/constants.ts";
import { pagesDir } from "../utils/utils.ts";

// deno-lint-ignore no-explicit-any
export const getPrivacyPolicy = async (ctx: any) => {
    await ctx.render(`${pagesDir}/${PageInformation.PrivacyPolicy.HtmlFile}`, {versionTag: versionTag});
}