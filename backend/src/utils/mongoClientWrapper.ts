import { Collection, Database, MongoClient } from "../../deps.ts";
import { User } from "../models/user.d.ts";
import { VisitorEntry } from "../models/visitorEntry.d.ts";

export class MongoClientWrapper {
    private static mClient: MongoClient;
    private static db: Database;
    private static users: Collection<User>;
    private static visitorEntries: Collection<VisitorEntry>;

    public static isConnected = false;

    // set constructor to private to prevent extending this class
    private constructor() { }

    private static async tryConnectUntilSuccess(uri: string): Promise<void> {
        const connectionInterval = setInterval(async () => {
            this.mClient.connectWithUri(uri);
            // if client gets dbs, its probably connected
            if (await this.mClient.listDatabases()) {
                console.log('Db connection established');
                this.isConnected = true;
                clearInterval(connectionInterval);
            } else {
                console.log('No connection to db could be made! Retrying in 10s')
            }
        }, 5000);
    }

    public static async initMongoClient(uri: string, dbName: string) {
        this.mClient = new MongoClient();
        await this.tryConnectUntilSuccess(uri);
        // code below here will only be called if connection could be made successfully
        this.db = this.mClient.database(dbName);
        this.users = this.db.collection<User>("users");
        this.visitorEntries = this.db.collection<VisitorEntry>("visitorEntries");
    }

    public static async insertVisitor(ip: string, date: string) {
        console.log(`Inserting new user. Ip: ${ip}`);
        await this.users.insertOne({
            ip: ip,
            date: date
        });
    }

    public static async insertVisitorEntry(entry: VisitorEntry) {
        console.log(`Inserting new visitor entry.\n ${JSON.stringify(entry)}`);
        await this.visitorEntries.insertOne({
            name: entry.name,
            message: entry.message,
            timestamp: entry.timestamp
        });
    }

    public static async getVisitorEntries(): Promise<VisitorEntry[]> {
        return this.visitorEntries.find();
    }

    // only for debuging
    // todo remove
    public static async printUsers() {
        const users = await this.users.find();
        console.log(users);
    }
}