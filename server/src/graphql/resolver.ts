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
        this.client = new PrismaClient({ datasources: { db: { url } } });
        this.root.user = () => this.client.user.findMany();
        this.root.chit = () => this.client.chit.findMany();
        this.root.group = () => this.client.group.findMany();

        this.root.createUser = async ({ input }: any) => {
            if (await this.client.user.findFirst({ where: { phone: input.phone } })) throw new Error("User with phone already exists");
            const result = await this.client.user.create({ data: input }).finally();
            return result;
        }
    }
}