import { Router } from 'express';
import * as multer from "multer";
import { Dbmgmt } from "chit-common";
import { ChitORM } from "chit-common";
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

router.get("/login", (req, res, next) => res.send("LOGGED_IN"));

router.get("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.type('json').status(200).send(JSON.stringify("LOGGED_OUT"));
  });
});
let isPostgress = (process.env.DATABASE_URL) ? true : false;
const pgdb = new ChitORM({ type: "postgres", url: process.env.DATABASE_URL });
const pgdbmgmt = new Dbmgmt(pgdb);
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
    await pgdbmgmt.closeDB();
    pgconnected = false;
  }
  connectedUsers--;
  return;
}

router.ws("/dbmgmt", async function (ws, req) {
  const pingInt = setInterval(() => {
    try {
      ws.ping();
    } catch (e) { console.log(e); }
  }, 5000);
  const user = req.session.user.name;
  let db: ChitORM;
  let dbmgmt: Dbmgmt;
  if (isPostgress) {
    db = pgdb;
    dbmgmt = pgdbmgmt;
    await pgconnect();
  } else {
    db = new ChitORM({ type: "sqlite", file: "./db/" + user + ".db" });
    dbmgmt = new Dbmgmt(db);
  }
  ws.on("message", async data => {
    if (typeof data !== "string") return;
    let args = JSON.parse(data);
    let response = await dbmgmt.runQuery(args);
    ws.send(JSON.stringify({ queryId: args.queryId, reply: response }));
  });
  ws.on("close", async code => {
    clearInterval(pingInt);
    await dbmgmt.closeDB();
    if(isPostgress)pgclose();
  });
});

router.use((req, res, next) => next());

export default router;
