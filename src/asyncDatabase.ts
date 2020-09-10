import sqlite from "./sqlite-async";
import { app } from "electron";
import { join } from "path";
import { existsSync } from "fs";
const dbfile: string = join(app.getPath("userData"), "./main.db");
let db : sqlite;

const openConnection = async () => {
  db = await sqlite.open(dbfile);
}
openConnection();