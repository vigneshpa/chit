import { Router } from 'express';
import * as multer from "multer";
import { Dbmgmt } from "chit-common";
import { join } from 'path';
import Orm from "chitorm";
import { type } from 'os';
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
    res.type('json').status(200).send(JSON.stringify("LOGGED_IN"));
  } else {
    res.type('json').status(401).send(JSON.stringify("LOGIN_FAILED"));
  }

});
router.use(function auth(req, res, next) {
  if (req.session.user?.loggedIn) {
    next();
    return;
  }
  res.status(401).render("error", { code: 401, title: "Forbidden!", message: "You are not allowed here." });
});

router.get("/login", (req, res, next)=>res.send("LOGGED_IN"));

router.get("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.type('json').status(200).send(JSON.stringify("LOGGED_OUT"));
  });
});



router.ws("/dbmgmt", async (ws, req) => {
  const pingInt = setInterval(()=>{
    ws.ping();
  }, 1000);
  const user = req.session.user.name;
  let connected: boolean = false;
  const db = new Orm({type:"sqlite", file:"./db/"+user+".db"});
  const dbmgmt = new Dbmgmt("./db/" + user + ".db", db);
  if (await dbmgmt.connect())connected = true;
  ws.on("message", async data => {
    if (connected) {
      let request = JSON.parse(<string>data);
      let response = await dbmgmt.runQuery(request.query, ...request.args);
      ws.send(JSON.stringify({ queryId: request.queryId, reply: response }));
    }
  });
  ws.on("close", async code => {
    await dbmgmt.closeDB();
    connected = false;
    clearInterval(pingInt);
  });
});

router.use((req, res, next) => next());

export default router;
