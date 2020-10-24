/**
 * return "Hello from  <name>!" string
 * @module utils
 * @param {string} name
 * @returns {string} Hello from <name>!
 */
export const greetings = (name: string): string => {
    return `Hello from ${name}!`;
}

export const generateTimestamp = (): string => {
    // todo: this offset makes utc+0 to utc+2; 2hrs in ms
    const offsetInMs = 2 * 60 * 60 * 1000
    const date = (new Date(Date.now() + offsetInMs)).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return date;
};
