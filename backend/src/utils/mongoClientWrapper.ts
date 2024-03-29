import { MongoClient, Database, Collection } from "../../deps.ts";
import { User } from "../models/user.d.ts";
import { VisitorEntry } from "../models/visitorEntry.d.ts";
import { LogEntry } from "../models/logEntry.d.ts";
import { Logger } from "./logger.ts";

export class MongoClientWrapper {
    private static mClient: MongoClient;
    private static db: Database;
    private static users: Collection<User>;
    private static visitorEntries: Collection<VisitorEntry>;
    private static logs: Collection<LogEntry>;
    private static userName: string;
    private static password: string;
    private static maxRetries = 3;

    public static isConnected = false;

    // set constructor to private to prevent extending this class
    private constructor() { }

    private static async tryConnectUntilSuccess(uri: string): Promise<void> {
        let retries = 0;
        await new Promise<void>((res, rej) => {
            Logger.startup(import.meta.url, `Starting connection interval with URI: ${uri}`);
            const connectionInterval = setInterval(async () => {
                // decide to connect with atlas or not
                try {
                    const db = await this.mClient.connect(uri);
                    if (db) Logger.startup(import.meta.url, `Client successfully connected!`);

                    // only reaches block when connecting works I guess
                    this.isConnected = true;
                    // todo? clearInterval + res or only res?
                    clearInterval(connectionInterval);
                    res();
                } catch (error) {
                    Logger.error(import.meta.url, error.message);
                    retries++;
                    if (retries >= this.maxRetries) {
                        clearInterval(connectionInterval);
                        rej('DB Connection Timeout');
                    }
                }
                // 30 sec interval
            }, 30000);
        });
    }

    public static async initMongoClient(uri: string, dbName: string): Promise<void> {
        this.mClient = new MongoClient();
        this.setCredentials(uri);
        try {
            await this.tryConnectUntilSuccess(uri);

            // code below here will only be called if connection could be made successfully
            this.db = this.mClient.database(dbName);
            Logger.startup(import.meta.url, `Using database: ${dbName}`);
            this.users = this.db.collection<User>("users");
            this.visitorEntries = this.db.collection<VisitorEntry>("visitorEntries");
            this.logs = this.db.collection<LogEntry>("logs");

            Logger.startup(import.meta.url, 'DB Setup successfull');
        } catch (error) {
            Logger.error(import.meta.url, `${error}`)
        }
    }

    public static async insertVisitor(ip: string, date: string): Promise<void> {
        await this.users.insertOne({
            ip: ip,
            date: date
        });
    }

    public static async getVisitorByIp(ip: string): Promise<User | undefined> {
        return await this.users.findOne({ ip: ip });
    }

    public static async insertVisitorEntry(entry: VisitorEntry): Promise<void> {
        Logger.debug(import.meta.url, `Inserting new visitor entry.\n ${JSON.stringify(entry)}`);
        await this.visitorEntries.insertOne({
            timestamp: entry.timestamp,
            name: entry.name,
            message: entry.message,
            ip: entry.ip
        });
    }

    public static async getVisitorEntries(): Promise<VisitorEntry[]> {
        return await this.visitorEntries.find().toArray();
    }

    public static async getVisitorEntriesByIp(ip: string): Promise<VisitorEntry[] | undefined> {
        return await this.visitorEntries.find({ ip: ip }).toArray();
    }

    public static async insertLog(logEntry: LogEntry): Promise<void> {
        await this.logs.insertOne({
            timestamp: logEntry.timestamp,
            level: logEntry.level,
            service: logEntry.service,
            message: logEntry.message,
        })
    }

    private static setCredentials(uri: string): void {
        const uriParts = uri.split(':');
        // remove '//'
        this.userName = uriParts[1].slice(2)
        // use part before '@'
        this.password = uriParts[2].split('@')[0]
        Logger.startup(import.meta.url, `Db credentials set! user: ${this.userName} password: ${this.password}`);
    }
}