import ChitORM from "./ChitORM";
let orm = new ChitORM({ type: "sqlite", file: "./main.db" });
orm.connect().then(async (connection) => {
    const user = new orm.User();
    user.name = "Timber";
    user.phone = "wefwef";
    user.address = "Some addres here";
    console.log("Inserting a new user into the database...");
    await orm.manager.user.save(user);
    console.log("Saved a new user with id: " + user.uuid);
    console.log("Loading users from the database...");
    const users = await orm.manager.user.find();
    console.log("Loaded users: ", users);
}).catch(error => console.log(error));
