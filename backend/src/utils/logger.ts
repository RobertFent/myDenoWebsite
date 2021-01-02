import { basename, bold, cyan, green, red } from '../../deps.ts';
import { generateTimestamp } from "./utils.ts";

type DebugLevel = 'Error' | 'Debug' | 'Info';

const writeToFile = async (line: string): Promise<void> => {
    try {
        await Deno.writeTextFile('../../log.txt', line);
        console.log(line)
    } catch (error) {
        console.log(error)
    }
}

export class Logger {
    
    // set constructor to private to prevent extending this class
    private constructor () {}

    // todo better type?
    private static log (level: DebugLevel, colorFct: (str: string) => string, serviceName: string, message: string) {
        const timestamp = generateTimestamp();
        const logLine = `${bold(timestamp)} -- ${colorFct(level)} -- ${colorFct(serviceName)} -- ${message}`;
        // do not await write to file
        console.log('writing into log file')
        void writeToFile(logLine);
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