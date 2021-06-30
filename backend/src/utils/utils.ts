import { format } from "../../deps.ts";

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

export const staticDir = `${Deno.cwd()}/frontend/static`
export const pagesDir = `${Deno.cwd()}/frontend/pages`
