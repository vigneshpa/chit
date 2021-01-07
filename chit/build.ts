/**
 * Chit Build file
 */
import bt from "../buildTools";
const build = async () => {

  bt.start();

  //Cleaning app directory
  bt.logi("Cleaning app folder");
  await bt.clean("./app");

  //Copying Config
  bt.logi("Copying configuration files");
  await bt.copy("./prod.env", "./app/.env");

  //Building common libraray
  bt.logi("Building common libraries");
  await bt.exec("npm", ["run", "build"], {cwd:"../chit-common"});

  //building orm
  bt.logi("Building ORM");
  await bt.exec("npm", ["run", "build"], {cwd:"../chit-orm"})

  //Building TypeScript
  bt.logi("Compiling TypeScript");
  await bt.exec("tsc",["-p", "tsconfig.prod.json"]);

  //Building Frontend
  if(!process.argv.includes("--skip-renderer")){
  bt.logi("Building vue framework");
  await bt.exec("npx",["vue-cli-service", "build"],  {cwd:"../chit-renderer"});
  }

  //Copying app files
  bt.logi("Copying built renderer files");
  bt.copy("../chit-renderer/app/", "./app/");

  //Copying resources
  bt.logi("Copying resources");
  bt.copy("./src/resources", "./app/resources");

  bt.end();
}
build();