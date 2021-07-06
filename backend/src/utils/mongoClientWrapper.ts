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

    private static async tryConnectUntilSuccess(uri: string, usesAtlas: boolean): Promise<void> {
        let retries = 0;
        await new Promise<void>((res, rej) => {
            const connectionInterval = setInterval(async () => {
                Logger.startup(import.meta.url, `Currently in connection interval; URI: ${uri}`);

                // decide to connect with atlas or not
                try {
                    const db = usesAtlas ? await this.mClient.connect({
                        db: "test",
                        tls: true,
                        servers: [
                            {
                            host: "denocluster-shard-00-02.s7s6n.mongodb.net",
                            port: 27017,
                            },
                        ],
                        credential: {
                            username: this.userName,
                            password: this.password,
                            db: "test",
                            mechanism: "SCRAM-SHA-1",
                        },
                        })
                    : await this.mClient.connect(uri);
                    Logger.startup(import.meta.url, `Connected to: ${db}`);
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
                        rej();
                    }
                }
                // 5 sec interval
            }, 5000);
        });
    }

    public static initMongoClient(uri: string, dbName: string, usesAtlas: boolean) {
        this.mClient = new MongoClient();
        Logger.startup(import.meta.url, `Using Atlas: ${usesAtlas}`);
        this.setCredentials(uri);
        this.tryConnectUntilSuccess(uri, usesAtlas).then(() => {
            // code below here will only be called if connection could be made successfully
            this.db = this.mClient.database(dbName);
            this.users = this.db.collection<User>("users");
            this.visitorEntries = this.db.collection<VisitorEntry>("visitorEntries");
            this.logs = this.db.collection<LogEntry>("logs");

            Logger.startup(import.meta.url, 'DB Setup successfull');
        }).catch(() => {
            Logger.error(import.meta.url, 'DB connection timed out!')
        });
        
    
        
    }

    public static async insertVisitor(ip: string, date: string) {
        Logger.debug(import.meta.url, `Inserting new user. Ip: ${ip}`);
        await this.users.insertOne({
            ip: ip,
            date: date
        });
    }

    public static async insertVisitorEntry(entry: VisitorEntry): Promise<void> {
        Logger.debug(import.meta.url, `Inserting new visitor entry.\n ${JSON.stringify(entry)}`);
        await this.visitorEntries.insertOne({
            timestamp: entry.timestamp,
            name: entry.name,
            message: entry.message,
        });
    }

    public static async getVisitorEntries(): Promise<VisitorEntry[]> {
        return await this.visitorEntries.find().toArray();
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
        Logger.startup(import.meta.url, `Db credentials set!\nuser: ${this.userName}\npassword: ${this.password}`);
    }
}