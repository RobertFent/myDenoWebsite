import { basename, bold, cyan, green, red, yellow, ensureDir } from '../../deps.ts';
import { generateTimestamp, generateCurrentDayTimestamp } from "./utils.ts";
import { MongoClientWrapper } from './mongoClientWrapper.ts';
import { LogEntry } from "../models/logEntry.d.ts";

type DebugLevel = 'ERROR' | 'DEBUG' | 'INFO' | 'STARTUP';

// deprecated
// appends given line to log.txt file
// deno-lint-ignore no-unused-vars
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

const writeToDB = (timestamp: string, level: DebugLevel, serviceName: string, message: string): Promise<void> | void => {
    try {
        const logEntry: LogEntry = {
            timestamp: timestamp,
            level: level,
            service: serviceName,
            message: message
        }
        // only log when db can be accessed and log is not a startup log
        if (MongoClientWrapper.isConnected && level !== 'STARTUP') return MongoClientWrapper.insertLog(logEntry);
    } catch (error) {
        console.log(`Could not write logs to db: ${error}`);
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
            console.log(`${bold(timestamp)} -- ${colorFct(level)} -- ${colorFct(serviceName)} -- ${message}`);
            // const fileLine = `${timestamp} -- ${level} -- ${serviceName} -- ${message}`;
            // writeToFile(fileLine);
            void writeToDB(timestamp, level, serviceName, message);
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

    public static startup(serviceName: string, message: string) {
        this.log('STARTUP', yellow, basename(serviceName), message);
    }
}