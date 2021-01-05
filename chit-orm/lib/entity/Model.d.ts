export default abstract class Model {
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    createUuid(): void;
    toJSON(): this & {
        id: any;
    };
}
