/**
 *  Chit Web build file.
 */
//const readFile = promisify(readFileP), writeFile = promisify(writeFileP);
import bt from './buildTools';
const buildDir = './dist';
import * as dotenv from 'dotenv';
dotenv.config({ path: './src/prod.env' });
import * as pug from 'pug';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
const build = async () => {
  try {
    bt.start();

    // Remove current build
    bt.logi('Cleaning current build');
    await bt.clean(buildDir);

    // Copy config files
    bt.logi('Copying dot files');
    await bt.copy('./src/prod.env', buildDir + '/.env');

    // Renderer will be copied by renderer build

    //Copying Renderer
    // bt.logi('Copying renderer files');
    // await bt.copy('../frontend/dist', buildDir + '/public/app');

    // Copy front-end files
    bt.logi('Copying front-end files');
    await bt.copy('./src/public', buildDir + '/public');
    await bt.copy('./src/views', buildDir + '/views');

    //Building pug static files
    bt.logi('Building pug static files');
    const files = await readdir('./src/static/');
    for (const file of files) {
      const pugstr = pug.render((await readFile('./src/static/' + file)).toString(), { env: process.env });
      writeFile(join(buildDir, '/public', file.replace(/\.pug$/, '.html')), pugstr);
    }

    //Modifiying package.json for production
    let pkg = JSON.parse((await readFile('./package.json')).toString());
    pkg.main = 'server.js';
    delete pkg.devDependencies;
    if (pkg.dependencies.sqlite3) delete pkg.dependencies.sqlite3;
    pkg.scripts = { start: 'node server.js' };
    await writeFile(buildDir + '/package.json', JSON.stringify(pkg));

    //Compiling TypeScript
    bt.logi('Building server TypeScript files');
    await bt.exec('npx', ['tsc', '--build', 'tsconfig.json']);

    //Compiling App
    bt.logi('Building SPA');
    await bt.exec('yarn', ['build'], { cwd: '../frontend' });

    bt.end();
  } catch (err) {
    bt.clean(buildDir);
    throw err;
  }
};
build();
