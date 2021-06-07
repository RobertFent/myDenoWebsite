import { MongoClient, Database, Collection } from "../../deps.ts";
import { User } from "../models/user.d.ts";
import { VisitorEntry } from "../models/visitorEntry.d.ts";
import { Logger } from "./logger.ts";

export class MongoClientWrapper {
    private static mClient: MongoClient;
    private static db: Database;
    private static users: Collection<User>;
    private static visitorEntries: Collection<VisitorEntry>;
    private static userName: string;
    private static password: string;

    public static isConnected = false;

    // set constructor to private to prevent extending this class
    private constructor() { }

    // todo interval takes 30sec if no connection can be made
    private static async tryConnectUntilSuccess(uri: string, usesAtlas: boolean): Promise<void> {
        Logger.debug(import.meta.url, 'Trying to connect until success');
        await new Promise<void>((res, rej) => {
            const connectionInterval = setInterval(async () => {
                Logger.debug(import.meta.url, `Currently in connection interval; URI: ${uri}`);

                // decide to connect with atlas or not
                const db = usesAtlas ? await this.mClient.connect({
                    db: "deno",
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

    public static async initMongoClient(uri: string, dbName: string, usesAtlas: boolean) {
        this.mClient = new MongoClient();
        Logger.debug(import.meta.url, `Using Atlas: ${usesAtlas}`);
        this.setCredentials(uri);
        await this.tryConnectUntilSuccess(uri, usesAtlas);
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

    private static setCredentials(uri: string): void {
        const uriParts = uri.split(':');
        // remove '//'
        this.userName = uriParts[1].slice(2)
        // use part before '@'
        this.password = uriParts[2].split('@')[0]
        Logger.debug(import.meta.url, `Db credentials set!\nuser: ${this.userName}\npassword: ${this.password}`);
    }
}