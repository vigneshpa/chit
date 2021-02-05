import { join } from "path";
import bt from "../buildTools";

bt.exec("tsc", ["-w"], { cwd: __dirname });

import * as nodemon from "nodemon";
nodemon({
    cwd: join(__dirname, "./dev/"),
    script: "server.js",
    ext: "js",
    watch: ["./dev"],
    ignore: ["./src/*.js"]
});

//bt.exec("npx", ["lt", "--port", "3000", "--subdomain", "chitapp"]);