import * as session from "express-session";
const CreateMemStore = require("memorystore")
const MemStore = CreateMemStore(session);
declare module 'express-session' {
  export interface SessionData {
    user: {
      loggedIn: boolean;
      name?:string;
    }
  }
}
const sessionParser = session({
  saveUninitialized: false,
  //Default secret value
  secret: process.env.SESSION_SECRET||"5sd4f6sd56sd6sdc645sdf6sd45f6sd5f6s",
  resave: false,
  store:new MemStore({checkPeriod:86400000}),
  cookie: {
    httpOnly: true
  }
});
export default sessionParser;