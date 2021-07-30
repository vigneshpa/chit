import * as session from 'express-session';
const CreateMemStore = require('memorystore');
const MemStore = CreateMemStore(session);
declare module 'express-session' {
  export interface SessionData {
    user: {
      loggedIn: boolean;
      name?: string;
    };
  }
}
const sessionParser = session({
  saveUninitialized: false,
  //Default secret value
  secret: process.env.SESSION_SECRET || 'SDG9A5DFG95ASFG95A9F56ADF5VADV5AD9G5A9RF',
  resave: false,
  store: new MemStore({ checkPeriod: 86400000 }),
  cookie: {
    httpOnly: true,
  },
});
export default sessionParser;
