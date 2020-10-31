import { basename, bold, cyan, green, red } from '../../deps.ts';
import { generateTimestamp } from "./utils.ts";

type DebugLevel = 'Error' | 'Debug' | 'Info';

export class Logger {
    
    // set constructor to private to prevent extending this class
    private constructor () {}

    // todo better type?
    private static log (level: DebugLevel, colorFct: (str: string) => string, serviceName: string, message: string) {
        const timestamp = generateTimestamp();
        console.log(`${bold(timestamp)} -- ${colorFct(level)} -- ${colorFct(serviceName)} -- ${message}`)
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