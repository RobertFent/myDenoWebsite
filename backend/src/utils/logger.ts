import { basename, bold, cyan, green, red } from '../../deps.ts';
import { generateTimestamp } from "./utils.ts";

type DebugLevel = 'Error' | 'Debug' | 'Info';

// appends given line to log.txt file
const writeToFile = (line: string): void => {
    try {
        Deno.writeTextFileSync('./log.txt', `${line}\n`, { append: true });
    } catch (error) {
        console.log(`RIP: ${error}`)
    }
}

export class Logger {
    
    // set constructor to private to prevent extending this class
    private constructor () {}

    private static log (level: DebugLevel, colorFct: (str: string) => string, serviceName: string, message: string) {
        const timestamp = generateTimestamp();
        const fileLine = `${timestamp} -- ${level} -- ${serviceName} -- ${message}`;
        console.log(`${bold(timestamp)} -- ${colorFct(level)} -- ${colorFct(serviceName)} -- ${message}`);
        writeToFile(fileLine);
    }

    public static info (serviceName: string, message: string) {
        this.log('Info', green, basename(serviceName), message);
    }

    public static debug (serviceName: string, message: string) {
        this.log('Debug', cyan, basename(serviceName), message);
    }

    public static error (serviceName: string, message: string) {
        this.log('Error', red, basename(serviceName), message);
    }
}