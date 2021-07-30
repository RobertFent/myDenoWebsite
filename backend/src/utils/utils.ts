import { format, RouterContext } from "../../deps.ts";
import { Logger } from "./logger.ts";

// this offset makes utc+0 to utc+1; 1hr in ms
const offsetInMs = 1 * 60 * 60 * 1000;

/**
 * return "Hello from  <name>!" string
 * @module utils
 * @param {string} name
 * @returns {string} Hello from <name>!
 */
export const greetings = (name: string): string => {
    return `Hello from ${name}!`;
}

/**
 * return yyyy-mm-dd hh:mm:ss timestamp
 * @module utils
 * @returns {string} yyyy-mm-dd hh:mm:ss
 */
export const generateTimestamp = (): string => {
    return (new Date(Date.now() + offsetInMs)).toISOString().replace(/T/, ' ').replace(/\..+/, '');
};

/**
 * return yyyy-mm-dd timestamp
 * @module utils
 * @returns {string} yyyy-mm-dd
 */
 export const generateCurrentDayTimestamp = (): string => {
    return format(new Date(), 'dd-MM-yyyy');
};

/**
 * returns current day as number
 * @module utils
 * @returns {number} dd
 */
export const getCurrentDay = (): number => {
    return new Date(Date.now() + offsetInMs).getDate();
}

/**
 * return day of given timestamp
 * @module utils
 * @param {string} own custom timestamp
 * @returns {number} day of given timestamp
 */
export const getDayFromCustomTimestamp = (timestamp: string): number => {
    const date = timestamp.split('-')[2];
    const day = date.split(' ')[0];
    return Number(day);
}

/**
 * read headers and returning x-real-ip if set
 * else returning x-forwarded-for
 * @param ctx RouterContext
 * @returns ip in string format 
 */
export const getIp = (ctx: RouterContext): string => {
    let realIp;
    try {
        realIp = ctx.request.headers.get('x-real-ip');
    } catch (error) {
        Logger.error(import.meta.url, `Error parsing x-real-ip: ${error.message}`)
    }
    // returning x-real-ip if it is set
    if (realIp) return realIp;
    
    // returning x-forwared-for if x-real-ip is not set
    Logger.debug(import.meta.url, 'No x-real-ip set! Falling back to x-forwarded-for...')
    return ctx.request.ip;
}

export const staticDir = `${Deno.cwd()}/frontend/static`
export const pagesDir = `${Deno.cwd()}/frontend/pages`
