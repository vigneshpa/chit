//Build functions
import * as cp from "child_process";
import * as fs from "fs-extra";
import * as chalk from "chalk";

const timestamps:{
  [key:string]:number
} = {};

function start(){
  timestamps.start = Date.now();
  log("Starting Build Process");
}

function end(){
  timestamps.end = Date.now();
  let buildTime;
  if(timestamps.start && timestamps.end){
    buildTime = (timestamps.end-timestamps.start) + "ms";
  }
  log("Completed building"+(buildTime?" in "+buildTime:"") + ".");
}

function exec(
  command: string,
  options?: {
    encoding?: "buffer";
  } & cp.ExecOptions
): Promise<number> {
  return new Promise((resolve, reject) => {


    log(chalk.dim("Executing " + command));
    let execprs = cp.exec(command, options, (error) => {
      if (error) {
        reject(error);
        return;
      }
    });
    execprs.stdout.pipe(process.stdout);
    execprs.stderr.pipe(process.stderr);
    execprs.on("exit", (code, signal) => {
      let color = "dim";
      if (code == 0) {
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
function clean(dir: string) {
  log(chalk.redBright(`Emptying ${dir} directory`));
  return fs.emptyDir(dir);
}
function copy(src: string, dest: string, options?: fs.CopyOptions) {
  log(chalk.yellow(`Copying ${src} to ${dest}`));
  return fs.copy(src, dest, options);
}

//Log functions
function logi(text: string) {
  console.log("\n", chalk.italic(text));
}
function log(...args: any[]) {
  console.log(...args);
}
export default { exec, clean, copy, log, logi, start, end};
