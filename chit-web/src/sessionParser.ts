import * as session from "express-session";
import {Dbmgmt} from "chitcore";
const CreateMemStore = require("memorystore")
const MemStore = CreateMemStore(session);
declare module 'express-session' {
  export interface SessionData {
    user: {
      loggedIn: boolean;
      name?:string;
      dbmgmt?:Dbmgmt;
    }
  }
}
const sessionParser = session({
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  resave: false,
  store:new MemStore({checkPeriod:86400000}),
  cookie: {
    httpOnly: true
  }
});
export default sessionParser;