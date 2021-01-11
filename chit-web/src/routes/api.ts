import { Router } from 'express';
import * as multer from "multer";
import { Dbmgmt } from "chit-common";
import Orm from "chitorm";
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
    res.type('json').status(200).json("LOGGED_IN");
  } else {
    res.type('json').status(401).json("LOGIN_FAILED");
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
  const dbmgmt = new Dbmgmt(db);
  if (await dbmgmt.connect())connected = true;
  ws.on("message", async data => {
    if(typeof data !== "string")return ws.close();
    if (connected) {
      let args = JSON.parse(data);
      let response = await dbmgmt.runQuery(args);
      ws.send(JSON.stringify({ queryId: args.queryId, reply: response }));
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
