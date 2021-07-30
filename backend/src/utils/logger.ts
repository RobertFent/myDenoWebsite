import { basename, bold, cyan, green, red, yellow } from '../../deps.ts';
import { generateTimestamp } from "./utils.ts";
import { MongoClientWrapper } from './mongoClientWrapper.ts';
import { LogEntry } from "../models/logEntry.d.ts";

const logLevelStrings = ['STARTUP', 'DEBUG', 'INFO', 'ERROR'];

export enum LogLevel {
    'STARTUP' = 0,
    'DEBUG',
    'INFO',
    'ERROR'
}

const writeToDB = (timestamp: string, level: string, serviceName: string, message: string): Promise<void> | void => {
    try {
        const logEntry: LogEntry = {
            timestamp: timestamp,
            level: level,
            service: serviceName,
            message: message
        }
        return MongoClientWrapper.insertLog(logEntry);
    } catch (error) {
        console.log(`Could not write logs to db: ${error}`);
    }
}

export class Logger {

    private static minLogLevel: LogLevel;
    private static loggerIsInit = false;

    // set constructor to private to prevent extending this class
    private constructor() {
    }

    public static init(logLevel: LogLevel) {
        this.minLogLevel = logLevel;
        console.log(`minLogLevel: ${logLevelStrings[this.minLogLevel]}`);
    }

    private static log(level: LogLevel, colorFct: (str: string) => string, serviceName: string, message: string) {
        const timestamp = generateTimestamp();
        const logLevel = logLevelStrings[level];

        // log message anyway
        console.log(`${bold(timestamp)} -- ${colorFct(logLevel)} -- ${colorFct(serviceName)} -- ${message}`);

        // write log not if it is startup
        if (level != LogLevel.STARTUP) {
            // save log to db if connected and proper log of proper loglevel
            if (MongoClientWrapper.isConnected) {
                if (level >= this.minLogLevel) void writeToDB(timestamp, logLevel, serviceName, message);
            } else if (serviceName != 'mongoClientWrapper.ts'){
                console.log(
                    `${bold(timestamp)} -- ${green(logLevelStrings[LogLevel.ERROR])} --  ` +
                    `${green(import.meta.url.split('/').pop() as string)} -- DB not connected! Log can't be written..`
                );
            }
        }
    }

    public static info(serviceName: string, message: string): void {
        this.log(LogLevel.INFO, green, basename(serviceName), message);
    }

    public static debug(serviceName: string, message: string): void {
        this.log(LogLevel.DEBUG, cyan, basename(serviceName), message);
    }

    public static error(serviceName: string, message: string): void {
        this.log(LogLevel.ERROR, red, basename(serviceName), message);
    }

    public static startup(serviceName: string, message: string): void {
        this.log(LogLevel.STARTUP, yellow, basename(serviceName), message);
    }
}