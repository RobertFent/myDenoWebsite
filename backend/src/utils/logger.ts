import { basename, bold, cyan, green, red, ensureDir } from '../../deps.ts';
import { generateTimestamp, generateCurrentDayTimestamp } from "./utils.ts";

type DebugLevel = 'ERROR' | 'DEBUG' | 'INFO';

// appends given line to log.txt file
const writeToFile = (line: string): void => {
    try {
        const currentDay = generateCurrentDayTimestamp();
        Deno.writeTextFileSync(`./logs/log_${currentDay}.txt`, `${line}\n`, { append: true });
    } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) {
            Logger.error('Logger', `Error writing logs! ${error}`);
        } else {
            // should never happen
            console.log('Log folder not found! Check if it is created!');
        }
    }
}

const setupLogEnv = (): void => { 
    ensureDir('./logs');
}

export class Logger {

    private static loggerIsInit = false;

    // set constructor to private to prevent extending this class
    private constructor() {
    }

    public static init() {
        setupLogEnv();
        this.loggerIsInit = true;
    }

    private static log(level: DebugLevel, colorFct: (str: string) => string, serviceName: string, message: string) {
        const timestamp = generateTimestamp();
        if (this.loggerIsInit) {
            const fileLine = `${timestamp} -- ${level} -- ${serviceName} -- ${message}`;
            console.log(`${bold(timestamp)} -- ${colorFct(level)} -- ${colorFct(serviceName)} -- ${message}`);
            writeToFile(fileLine);
        } else {
            console.log(`${bold(timestamp)} -- ${red('ERROR')} -- ${red(serviceName)} -- no logger is initialized!`);
        }

    }

    public static info(serviceName: string, message: string) {
        this.log('INFO', green, basename(serviceName), message);
    }

    public static debug(serviceName: string, message: string) {
        this.log('DEBUG', cyan, basename(serviceName), message);
    }

    public static error(serviceName: string, message: string) {
        this.log('ERROR', red, basename(serviceName), message);
    }
}