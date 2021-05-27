import { PrismaClient } from "@prisma/client";
export default class Resolver {
    root: any;
    name: string;
    client: PrismaClient;
    constructor(userName: string) {
        this.root = {};
        this.name = userName;
        //Using default public schema untill creating user managemet
        const url = process.env.DATABASE_URL /* + "?schema=" + this.name */;
        console.log(url);
        this.client = new PrismaClient({ datasources: { db: { url } } });
        this.root.user = () => this.client.user.findMany();
    }
}