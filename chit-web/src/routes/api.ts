import { Router } from 'express';
import * as multer from "multer";
import { Dbmgmt } from "chitcore";
const upload = multer();
const router = Router();

router.post("/login", upload.none(), function (req, res, next) {
  if (req.session.user?.loggedIn) {
    next();
    return;
  }

  if (req.body.user === "admin" && req.body.pwd === "admin") {
    req.session.user = {
      loggedIn: true,
      name: "admin"
    };
    res.status(200).json("LOGGED_IN");
  } else {
    res.status(401).json("LOGIN_FAILED");
  }

});
router.use(function auth(req, res, next) {
  if (req.session.user?.loggedIn) {
    next();
    return;
  }
  res.status(401).render("error", { code: 401, title: "Forbidden!", message: "You are not allowed here." });
});

router.get("/login", (req, res, next) => res.status(200).json("LOGGED_IN"));

router.get("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.status(200).json("LOGGED_OUT");
  });
});
let isPostgress = (process.env.DATABASE_URL) ? true : false;
const pgOptions: { type: "postgres", url: string, ssl?: { rejectUnauthorized: false } } = { type: "postgres", url: process.env.DATABASE_URL };
if (process.env?.DISABLE_PG_SSL !== "true") {
  pgOptions.ssl = { rejectUnauthorized: false };
}
const pgdbmgmt = new Dbmgmt(pgOptions);
let pgconnected = false;
let pgConnecting = false;
let connectedUsers = 0;
async function pgconnect() {
  if (!(pgconnected || pgConnecting)) {
    pgConnecting = true;
    await pgdbmgmt.connect();
    pgConnecting = false;
    pgconnected = true;
  }
  connectedUsers++;
  return;
}
async function pgclose() {
  if (pgconnected && connectedUsers <= 1 && !pgConnecting) {
    await pgdbmgmt.close();
    pgconnected = false;
  }
  connectedUsers--;
  return;
}

router.ws("/dbmgmt", async function (ws, req) {

  //Auth
  if (!req.session.user?.loggedIn) return ws.close();

  // Ping Timer
  const pingInt = setInterval(() => {
    try {
      ws.ping();
    } catch (e) { console.log(e); }
  }, 5000);


  const user = req.session.user.name;
  let dbmgmt: Dbmgmt;


  //STARTING DELAYED query WARPER
  let connected: boolean = false;
  const afterconnectFunctions: (() => void)[] = [];
  const executeAfterconnect = () => afterconnectFunctions.forEach(fn => fn());

  // Opening connection
  if (isPostgress) {
    dbmgmt = pgdbmgmt;
    (async function () {
      await pgconnect();
      connected = true;
      executeAfterconnect();
    })();
  } else {
    dbmgmt = new Dbmgmt({ type: "sqlite", database: "./" + user + ".db" });
    (async function () {
      await dbmgmt.connect();
      connected = true;
      executeAfterconnect();
    })();
  }
  const delayedQuery = (args: DbmgmtQueryArgs) => {
    return new Promise((resolve: (value: DbmgmtQueryArgs["ret"]) => void, reject) => {
      if (connected) {
        dbmgmt.runQuery(args).then(resolve);
      } else {
        afterconnectFunctions.push(() => dbmgmt.runQuery(args).then(resolve));
      }
    });
  }




  // Binding listeners
  ws.on("message", async data => {
    if (typeof data !== "string") return;
    const args = JSON.parse(data);
    let response: DbmgmtQueryArgs["ret"];
    if (connected) {
      response = await dbmgmt.runQuery(args);
    } else response = await delayedQuery(args);
    ws.send(JSON.stringify({ queryId: args.queryId, reply: response }));
  });

  // Closing connection
  ws.on("close", async code => {
    clearInterval(pingInt);
    if (isPostgress) {
      await pgclose();
    } else {
      await dbmgmt.close();
    }
    connected = false;
  });
});

router.use((req, res, next) => next());

export default router;
