/**
 * Chit Build file
 */
import bt from "chit-common/src/buildTools";

const build = async () => {

  //Cleaning app directory
  bt.logi("Cleaning app folder");
  await bt.clean("./app");

  //Copying Config
  bt.logi("Copying configuration files");
  await bt.copy("./prod.env", "./app/.env");
  await bt.copy("./default.config.json", "./app/default.config.json");

  //Building TypeScript
  bt.logi("Compiling TypeScript");
  await bt.exec("tsc -p tsconfig.prod.json");
}

build();