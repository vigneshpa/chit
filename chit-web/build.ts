/**
 *  Chit Web build file.
 */
import { readFile as readFileP, writeFile as writeFileP } from "fs";
import { promisify } from "util";
const readFile = promisify(readFileP), writeFile = promisify(writeFileP);
import bt from "../buildTools";
const buildDir = "./dist";
const build = async () => {
    try {

        bt.start();

        // Remove current build
        bt.logi("Cleaning current build");
        await bt.clean(buildDir);

        //Building renderer
        bt.log("Building renderer");
        if (!process.argv.includes("--skip-renderer"))
            await bt.exec("npx", ["vue-cli-service", "build"], { cwd: "../chit-renderer" });

        //Copying Renderer
        bt.logi("Copying renderer files");
        await bt.copy("../chit-renderer/app/renderer", "./dist/public/app");

        // Building frontend JS
        bt.logi("Building browser support files");
        await bt.exec('npx', ['rollup', '-c']);

        // Copy front-end files
        bt.logi("Copying front-end files")
        await bt.copy('./src/public', './dist/public');
        await bt.copy('./src/views', './dist/views');

        //Building pug static files
        bt.logi("Building pug static files");
        await bt.exec("pug", ["./src/static", "-o", "./dist/public"]);

        //Building chit common libraries
        bt.logi("Building common libraries");
        await bt.exec("npm", ["run", "compile"], { cwd: "../chit-core" });

        //copying chit common libraries
        bt.logi("Copying Common libs");
        await bt.copy("../chit-core/lib", "./dist/chit-core/lib");
        await bt.copy("../chit-core/package.json", "./dist/chit-core/package.json");

        // Copy config files
        bt.logi("Copying configuration files");
        await bt.copy('./src/prod.env', './dist/.env');

        //Modifiying package.json for production
        let pkg = JSON.parse((await readFile("./package.json")).toString());
        pkg.main = "server.js";
        delete pkg.devDependencies;
        if(pkg.dependencies.sqlite3)delete pkg.dependencies.sqlite3
        pkg.scripts = { start: "node server.js" };
        pkg.dependencies["chitcore"] = "file:./chit-core";
        await writeFile("./dist/package.json", JSON.stringify(pkg));
        //await bt.copy('./package.prod.json', './dist/package.json');

        //Compiling TypeScript
        bt.logi("Building server TypeScript files");
        await bt.exec('tsc', ['--build', 'tsconfig.prod.json']);

        //Create db directory
        await bt.fs.ensureFile("./dist/db/placeholder");

        bt.end();

    } catch (err) {
        bt.clean(buildDir);
        throw err;
    }
};
build();