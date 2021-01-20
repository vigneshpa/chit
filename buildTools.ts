//Build functions
import * as cp from "child_process";
import * as fs from "fs-extra";
import * as chalk from "chalk";
import { join } from "path";

const timestamps:{
  [key:string]:number
} = {};

function start(){
  console.time("Completed building in ");
  log("Starting Build Process");
}

function end(){
  console.time("Completed building in ");
}

function exec(
  command: string,
  args?:string[],
  options?: {
    encoding?: "buffer";
  } & cp.SpawnOptions
): Promise<number> {
  return new Promise((resolve, reject) => {


    log(chalk.dim("Executing " + command));
    options = options?options:{};
    options.stdio = options.stdio?options.stdio:"inherit";
    let execprs = cp.spawn(command,args, options);
    execprs.on("exit", (code, signal) => {
      let color = "dim";
      if (code === 0) {
        color = "green";
      } else {
        color = "redBright";
      }
      log(
        chalk[color](
          "Process exited with code " + code + " and signal " + signal
        )
      );
      if (code !== 0)
        throw new Error(
          `Process ${command} exitted with code ${code} and signal ${signal}`
        );
      resolve(code);


    });
  });
}
async function clean(dir: string) {
  log(chalk.redBright(`Emptying ${dir} directory`));
  let hasGit = await fs.pathExists(join(dir, ".git"));
  if(hasGit){
    log(chalk.dim("Found .git backing up it"));
    await fs.move(join(dir, ".git"), "./tmp/.git");
  }
  await fs.remove(dir);
  await fs.mkdirp(dir);
  if(hasGit){
    await fs.move("./tmp/.git", join(dir, ".git"));
  }
}
function copy(src: string, dest: string, options?: fs.CopyOptions) {
  log(chalk.yellow(`Copying `)+chalk.white(src)+chalk.yellow(` to `)+chalk.white(`${dest}`));
  return fs.copy(src, dest, options);
}

//Log functions
function logi(text: string) {
  console.log("\n", chalk.italic(text));
}
function log(...args: any[]) {
  console.log(...args);
}
export default { exec, clean, copy, log, logi, start, end, fs};
