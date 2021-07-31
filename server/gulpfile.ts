import { src, dest, series, parallel, watch } from 'gulp';
import * as del from 'del';
import * as gpug from 'gulp-pug';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { spawn, exec } from 'child_process';
import * as nodemon from 'nodemon';

const clean = () => del('./dist/**/*', { dot: true });

const copyConfigFiles = () => copyFile('./src/prod.env', './dist/.env');

const frontendBuild = () => spawn('yarn', ['build'], { cwd: '../frontend' });
const copyBundeles = () => src('../frontend/dist/**/*').pipe(dest('./dist/public/app'));
const buildFrontend = series(frontendBuild, copyBundeles);

const copyPublicFiles = () => src('./src/public/**/*').pipe(dest('./dist/public'));
const copyViews = () => src('./src/views/**/*').pipe(dest('./dist/views'));

const compilePugStatic = () =>
  src('./src/static/**/*.pug')
    .pipe(gpug({ data: { env: process.env } }))
    .pipe(dest('./dist/public'));

const modifyPackageJson = async () => {
  let pkg = JSON.parse((await readFile('./package.json')).toString());
  pkg.main = 'server.js';
  delete pkg.devDependencies;
  if (pkg.dependencies.sqlite3) delete pkg.dependencies.sqlite3;
  if (pkg.dependencies.core) pkg.dependencies.core = 'core.tar.gz';
  pkg.scripts = { start: 'node server.js' };
  await writeFile('./dist/package.json', JSON.stringify(pkg));
};

const compileBackend = () => spawn('npx', ['tsc', '--build', 'tsconfig.json']);

const build = parallel(copyPublicFiles, copyViews, copyConfigFiles, modifyPackageJson, compilePugStatic, compileBackend, buildFrontend);
export default series(clean, build);

// Dev server

const watchFrontend = () => spawn('yarn', ['watch'], { cwd: '../frontend' });
const watchCore = () => spawn('yarn', ['watch'], { cwd: '../core' });
const upgradeCore = () => spawn('yarn', ['upgrade', 'core']);
const coreUpgrader = () => watch('../core/lib/**/*', { persistent: true }, upgradeCore);
const startBackend = (done: any) => {
  const nm = nodemon({
    exec: 'npx ts-node',
    cwd: './src',
    env: {
      RENDERER_PATH: join(__dirname, '../frontend/dist'),
    },
    quiet: false,
    verbose: true,
    script: 'server.ts',
  });
  process.on('SIGHUP', () => nm.emit('quit'));
  nm.on('start', () => console.log('Nodemon started'));
  nm.on('exit', () => {
    console.log('Nodemon exited');
    done();
  });
  nm.on('crash', () => console.log('Nodemon crashed'));
  nm.on('stderr', stderr => console.log('stderr: ', stderr));
  nm.on('stdout', stdout => console.log('stdout: ', stdout));
  // nm.on('log', log => console.log(log.colour));
};
export const serve = parallel(watchFrontend, watchCore, coreUpgrader, startBackend);
