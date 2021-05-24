import { MongoClient, Database, Collection } from "../../deps.ts";
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

    // todo interval takes 30sec if no connection can be made
    private static async tryConnectUntilSuccess(uri: string): Promise<void> {
        Logger.debug(import.meta.url, 'Trying to connect until success');
        await new Promise<void>((res, rej) => {
            const connectionInterval = setInterval(async () => {
                Logger.debug(import.meta.url, `Currently in connection interval; URI: ${uri}`);
                // used for mongo atlas
                /* const db = await this.mClient.connect({
                    db: "deno",
                    tls: true,
                    servers: [
                      {
                        host: "denocluster-shard-00-02.s7s6n.mongodb.net",
                        port: 27017,
                      },
                    ],
                    credential: {
                      username: "root",
                      password: "Q0Da8hLVr37zTm5N",
                      db: "deno",
                      mechanism: "SCRAM-SHA-1",
                    },
                  });
                  */
                
                const db = await this.mClient.connect(uri);
                Logger.debug(import.meta.url, `Connected to: ${db}`);
                // only reaches block when connecting works I guess
                this.isConnected = true;
                // todo? clearInterval + res or only res?
                clearInterval(connectionInterval);
                res();
                // 5 sec interval
            }, 5000);
        });
    }

    public static async initMongoClient(uri: string, dbName: string) {
        this.mClient = new MongoClient();
        await this.tryConnectUntilSuccess(uri);
        // code below here will only be called if connection could be made successfully
        this.db = this.mClient.database(dbName);
        this.users = this.db.collection<User>("users");
        this.visitorEntries = this.db.collection<VisitorEntry>("visitorEntries");

        Logger.debug(import.meta.url, `DB Setup successfull`);
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
        return await this.visitorEntries.find().toArray();
    }
}