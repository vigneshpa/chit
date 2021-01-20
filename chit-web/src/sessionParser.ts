
import * as session from "express-session";
import {Dbmgmt} from "chit-common";
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
  cookie: {
    httpOnly: true
  }
});
export default sessionParser;