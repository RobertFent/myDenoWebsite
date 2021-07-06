import { basename, bold, cyan, green, red, yellow, ensureDir } from '../../deps.ts';
import { generateTimestamp, generateCurrentDayTimestamp } from "./utils.ts";
import { MongoClientWrapper } from './mongoClientWrapper.ts';
import { LogEntry } from "../models/logEntry.d.ts";

const logLevelStrings = ['STARTUP', 'DEBUG', 'INFO', 'ERROR'];

export enum LogLevel {
    'STARTUP' = 0,
    'DEBUG',
    'INFO',
    'ERROR'
}

// deprecated
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

const writeToDB = (timestamp: string, level: string, serviceName: string, message: string): Promise<void> | void => {
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

    private static minLogLevel: LogLevel;
    private static loggerIsInit = false;

    // set constructor to private to prevent extending this class
    private constructor() {
    }

    public static init(logLevel: LogLevel) {
        setupLogEnv();
        this.minLogLevel = logLevel;
        this.loggerIsInit = true;
        console.log(`minLogLevel: ${logLevelStrings[this.minLogLevel]}`);
    }

    private static log(level: LogLevel, colorFct: (str: string) => string, serviceName: string, message: string) {
        const timestamp = generateTimestamp();
        const logLevel = logLevelStrings[level];
        if (this.loggerIsInit) {
            console.log(`${bold(timestamp)} -- ${colorFct(logLevel)} -- ${colorFct(serviceName)} -- ${message}`);
            const fileLine = `${timestamp} -- ${logLevel} -- ${serviceName} -- ${message}`;
            MongoClientWrapper.isConnected && level >= this.minLogLevel ? void writeToDB(timestamp, logLevel, serviceName, message) : writeToFile(fileLine);
        } else {
            console.log(`${bold(timestamp)} -- ${red('ERROR')} -- ${red(serviceName)} -- no logger is initialized!`);
        }

    }

    public static info(serviceName: string, message: string) {
        this.log(LogLevel.INFO, green, basename(serviceName), message);
    }

    public static debug(serviceName: string, message: string) {
        this.log(LogLevel.DEBUG, cyan, basename(serviceName), message);
    }

    public static error(serviceName: string, message: string) {
        this.log(LogLevel.ERROR, red, basename(serviceName), message);
    }

    public static startup(serviceName: string, message: string) {
        this.log(LogLevel.STARTUP, yellow, basename(serviceName), message);
    }
}