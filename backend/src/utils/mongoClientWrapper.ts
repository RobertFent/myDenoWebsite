import { Collection, Database, MongoClient } from "../../deps.ts";
import { User } from "../models/user.d.ts";

export class MongoClientWrapper {
    private static mClient: MongoClient;
    private static db: Database;
    private static users: Collection<User>;

    public static isConnected = false;

    // set constructor to private to prevent extending this class
    private constructor () {}

    public static initMongoClient (uri: string, dbName: string) {
        this.mClient = new MongoClient();
        this.mClient.connectWithUri(uri);
        this.db = this.mClient.database(dbName);
        this.users = this.db.collection<User>("users");
        this.isConnected = true;
    }

    public static async insertUser (ip: string, date: string) {
        await this.users.insertOne({
            ip: ip,
            date: date
        })
    }

    // only for debuging
    // todo remove
    public static async printUsers () {
        const users = await this.users.find();
        console.log(users);
    }
}