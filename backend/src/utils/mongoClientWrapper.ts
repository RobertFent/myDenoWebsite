import { Collection, Database, MongoClient } from "../../deps.ts";
import { User } from "../models/user.d.ts";
import { VisitorEntry } from "../models/visitorEntry.d.ts";
import { Logger } from "./logger.ts";

export class MongoClientWrapper {
    private static mClient: MongoClient;
    private static db: Database;
    private static users: Collection<User>;
    private static visitorEntries: Collection<VisitorEntry>;

    public static isConnected = false;

    // set constructor to private to prevent extending this class
    private constructor() { }

    private static async tryConnectUntilSuccess(uri: string): Promise<void> {
        Logger.debug(import.meta.url, 'Trying to connect until success');
        await new Promise((res, rej) => {
            const connectionInterval = setInterval(async () => {
                Logger.debug(import.meta.url, 'Currently in connection interval');
                this.mClient.connectWithUri(uri);
                // if client gets dbs, its probably connected
                if (await this.mClient.listDatabases()) {
                    Logger.info(import.meta.url, 'Db connection established');
                    this.isConnected = true;
                    // todo? clearInterval + res or only res?
                    clearInterval(connectionInterval);
                    res();
                } else {
                    Logger.error(import.meta.url, 'No connection to db could be made! Retrying in 5s');
                }
                // 5 sec interval
            }, 5000);
        });
    }

    public static async initMongoClient(uri: string, dbName: string) {
        this.mClient = new MongoClient();
        await this.tryConnectUntilSuccess(uri);
        // code below here will only be called if connection could be made successfully
        Logger.info(import.meta.url, 'selecting db');
        this.db = this.mClient.database(dbName);
        this.users = this.db.collection<User>("users");
        this.visitorEntries = this.db.collection<VisitorEntry>("visitorEntries");
    }

    public static async insertVisitor(ip: string, date: string) {
        Logger.debug(import.meta.url, `Inserting new user. Ip: ${ip}`);
        await this.users.insertOne({
            ip: ip,
            date: date
        });
    }

    public static async insertVisitorEntry(entry: VisitorEntry) {
        Logger.debug(import.meta.url, `Inserting new visitor entry.\n ${JSON.stringify(entry)}`);
        await this.visitorEntries.insertOne({
            name: entry.name,
            message: entry.message,
            timestamp: entry.timestamp
        });
    }

    public static async getVisitorEntries(): Promise<VisitorEntry[]> {
        return this.visitorEntries.find();
    }
}