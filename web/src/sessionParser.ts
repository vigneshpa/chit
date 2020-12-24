
import * as session from "express-session";
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
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    httpOnly: true
  }
});
export default sessionParser;