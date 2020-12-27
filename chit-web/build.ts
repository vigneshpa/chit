/**
 *  Chit Web build file.
 */
import bt from "../buildTools";
import rollup from "rollup";
const buildDir = "./dist";
const build = async () => {
    try {

        bt.start();

        // Remove current build
        bt.logi("Cleaning current build");
        await bt.clean(buildDir);

        // Copy front-end files
        bt.logi("Copying front-end files")
        await bt.copy('./src/public', './dist/public');
        await bt.copy('./src/views', './dist/views');

        //Building pug static files
        bt.logi("Building pug static files");
        await bt.exec("pug", ["./src/static", "-o", "./dist/public"]);

        // Copy production env file
        bt.logi("Copying configuration files");
        await bt.copy('./src/prod.env', './dist/.env');

        //Compiling TypeScript
        bt.logi("Building frontend and backend TypeScript files");
        // Building backend JS
        await bt.exec('tsc', ['--build', 'tsconfig.prod.json']);
        // Building frontend JS
        await bt.exec('tsc', ['--build', 'tsconfig.json'], {cwd:"./browserSupport"});

        bt.end();

    } catch (err) {
        bt.clean(buildDir);
        throw err;
    }
};
build();