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
let connectedUsers = 0;
async function pgconnect() {
  if (!pgconnected) {
    await pgdbmgmt.connect();
    pgconnected = true;
  }
  connectedUsers++;
  return;
}
async function pgclose() {
  if (pgconnected && connectedUsers <= 1) {
    await pgdbmgmt.close();
    pgconnected = false;
  }
  connectedUsers--;
  return;
}

router.ws("/dbmgmt", async function (ws, req) {

  // Ping Timer
  const pingInt = setInterval(() => {
    try {
      ws.ping();
    } catch (e) { console.log(e); }
  }, 5000);


  const user = req.session.user.name;
  let dbmgmt: Dbmgmt;

  // Opening connection
  if (isPostgress) {
    dbmgmt = pgdbmgmt;
    await pgconnect();
  } else {
    dbmgmt = new Dbmgmt({ type: "sqlite", database: "./" + user + ".db" });
    await dbmgmt.connect();
  }

  // Binding listeners
  ws.on("message", async data => {
    if (typeof data !== "string") return;
    let args = JSON.parse(data);
    let response = await dbmgmt.runQuery(args);
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
  });
});

router.use((req, res, next) => next());

export default router;
