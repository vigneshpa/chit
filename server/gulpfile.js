const { spawn, exec } = require('child_process');
const { copyFile, readFile, writeFile, rename } = require('fs/promises');
const { join } = require('path');
const { promisify } = require('util');
const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const nodemon = require('nodemon');
const gpug = require('gulp-pug');

const execP = promisify(exec);

const outDir = '../dist';

const buildDir = './dist';

const clean = () => del([buildDir, outDir], { dot: true, force: true });

const copyConfigFiles = () => copyFile('./src/prod.env', buildDir + '/.env');

const compileFrontend = () => spawn('npm', ['run', 'build'], { cwd: '../frontend' });
const copyBundeles = () => src('../frontend/dist/**/*').pipe(dest(buildDir + '/public/app'));
const buildFrontend = series(compileFrontend, copyBundeles);

const copyPublicFiles = () => src('./src/public/**/*').pipe(dest(buildDir + '/public'));
const copyViews = () => src('./src/views/**/*').pipe(dest(buildDir + '/views'));

const compilePugStatic = () =>
  src('./src/static/**/*.pug')
    .pipe(gpug({ data: { env: process.env } }))
    .pipe(dest(buildDir + '/public'));

const modifyPackageJson = async () => {
  const pkg = JSON.parse((await readFile('./package.json')).toString());
  pkg.main = 'server.js';
  delete pkg.devDependencies;
  if (pkg.dependencies.sqlite3) delete pkg.dependencies.sqlite3;
  if (pkg.dependencies.core) {
    const cp = await execP('npm pack --json --pack-destination ' + join(__dirname, buildDir), { cwd: pkg.dependencies.core });
    if (cp.stderr) console.error(cp.stderr);
    const stdout = JSON.parse(cp.stdout);
    pkg.dependencies.core = './' + stdout[0].filename;
  }
  pkg.engines = { node: process.version.replace(/[^0-9.]/g, '') };
  pkg.scripts = { start: 'node server.js' };
  await writeFile(buildDir + '/package.json', JSON.stringify(pkg));
};

const compileBackend = () => spawn('npx', ['tsc', '--build', 'tsconfig.json']);

const build = parallel(copyPublicFiles, copyViews, modifyPackageJson, compilePugStatic, compileBackend, buildFrontend);
const moveDist = () => rename(buildDir, outDir);
exports.default = series(clean, build, copyConfigFiles, moveDist);

// Develpoement server --------------------------------------------------------------------------//

const watchFrontend = () => spawn('npm', ['run', 'watch'], { cwd: '../frontend' });
const nmRestart = { restart: async () => {}, cal: () => nmRestart.restart() };
const startBackend = done => {
  const nm = nodemon({
    exec: 'npx ts-node',
    cwd: './src',
    env: {
      RENDERER_PATH: join(__dirname, '../frontend/dist'),
    },
    delay: 200,
    script: 'server.ts',
  });
  nmRestart.restart = async () => nm.emit('restart');
  process.on('SIGHUP', () => nm.emit('quit'));
  nm.on('start', () => console.log('Nodemon started'));
  nm.on('exit', () => console.log('Nodemon exited'));
  nm.on('crash', () => console.log('Nodemon crashed'));
  nm.on('stderr', stderr => console.log('stderr: ', stderr));
  nm.on('stdout', stdout => console.log('stdout: ', stdout));
  // nm.on('log', log => console.log(log.colour));
};
const upcr = () => spawn('npm', ['run', 'upcr']);
const upgradeCore = series(upcr, nmRestart.cal);
const coreUpgrader = () => watch(join(__dirname, '../core/src/**/*.ts'), { delay: 5000 }, upgradeCore);
exports.serve = parallel(watchFrontend, startBackend, coreUpgrader);
