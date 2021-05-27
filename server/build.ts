/**
 *  Chit Web build file.
 */
import { createWriteStream, fstat, readFile as readFileP, writeFile as writeFileP } from "fs";
//const readFile = promisify(readFileP), writeFile = promisify(writeFileP);
import bt from "./buildTools";
const buildDir = "./dist";
import * as dotenv from "dotenv";
dotenv.config({ path: "./src/prod.env" });
import * as pug from "pug";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
const build = async () => {
    try {

        bt.start();

        // Remove current build
        bt.logi("Cleaning current build");
        await bt.clean(buildDir);

        // Copy config files
        bt.logi("Copying configuration files");
        await bt.copy('./src/prod.env', buildDir + '/.env');

        //Copying Renderer
        bt.logi("Copying renderer files");
        await bt.copy("../frontend/dist", buildDir + "/public/app");

        //Building pug static files
        bt.logi("Building pug static files");
        const files = await readdir("./src/static/");
        for (const file of files) {
            const pugstr = pug.render((await readFile("./src/static/"+file)).toString(), { env: process.env });
            writeFile(join(buildDir, "/public", file.replace(/\.pug$/, ".html")), pugstr);
        };

        // Copy front-end files
        bt.logi("Copying front-end files")
        await bt.copy('./src/public', buildDir + '/public');
        await bt.copy('./src/views', buildDir + '/views');

        //Copying users info
        bt.logi("Copying users info");
        await bt.copy("./src/users.prod.json", buildDir + "/users.json");

        //Modifiying package.json for production
        let pkg = JSON.parse((await readFile("./package.json")).toString());
        pkg.main = "server.js";
        delete pkg.devDependencies;
        if (pkg.dependencies.sqlite3) delete pkg.dependencies.sqlite3
        pkg.scripts = { start: "node server.js" };
        await writeFile(buildDir + "/package.json", JSON.stringify(pkg));

        //Compiling TypeScript
        bt.logi("Building server TypeScript files");
        await bt.exec('tsc', ['--build', 'tsconfig.json']);

        //Create db directory
        bt.logi("Creating db directory")
        await bt.fs.ensureFile(buildDir + "/db/placeholder");

        //copying prisma schema
        bt.logi("Copying prisma ORM schema");
        await bt.copy("./prisma/schema.prisma", buildDir+"/schema.prisma");

        bt.end();

    } catch (err) {
        bt.clean(buildDir);
        throw err;
    }
};
build();