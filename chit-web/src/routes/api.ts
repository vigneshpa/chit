import { Router } from 'express';
import * as multer from "multer";
import { Dbmgmt } from "chitcore";
import { Client } from "pg";
import * as pgFormat from "pg-format";
import { readFileSync } from 'fs';
const users: { [user: string]: string } = JSON.parse((readFileSync("users.json")).toString());
const upload = multer();
const router = Router();

router.post("/login", upload.none(), function (req, res, next) {
  if (req.session.user?.loggedIn) {
    next();
    return;
  }

  if (users.hasOwnProperty(req.body.user) && req.body.pwd === users[req.body.user]) {
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

// Virtual Dbmgmt WebSocket Connection
router.ws("/dbmgmt", async function (ws, req) {

  //Auth
  if (!req.session.user?.loggedIn) return ws.close(401, "You are not allowed here");

  // Ping Timer
  const pingInt = setInterval(() => {
    try {
      ws.ping();
    } catch (e) { console.log(e); }
  }, 5000);


  const user = req.session.user.name;

  //STARTING DELAYED query WARPER
  let connected: boolean = false;
  const afterconnectFunctions: (() => void)[] = [];
  const executeAfterconnect = () => afterconnectFunctions.forEach(fn => fn());

  // Opening Database Connection
  const options: DbmgmtOptions = (process.env.DATABASE_URL) ?
    {
      type: "postgres",
      name: (Math.random()*(10**10))+"",
      url: process.env.DATABASE_URL,
      ssl: ((process.env?.DISABLE_PG_SSL !== "true") ?
        { rejectUnauthorized: false }
        : null),
      schema: user
    }
    : { type: "sqlite", database: "./" + user + ".db" };
  const dbmgmt = new Dbmgmt(options);
  (async function () {
    if (options.type == "postgres") {
      if (options.schema) {
        console.log("Checking existance of ", user, " in DB");
        const client = new Client({ ssl: options.ssl, connectionString: options.url });
        await client.connect();
        await client.query("CREATE SCHEMA IF NOT EXISTS " + pgFormat(options.schema) + ";");
        await client.end();
      }
    }
    await dbmgmt.connect();
    connected = true;
    executeAfterconnect();
  })();


  //Handeling Queries before DB connection
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
    console.log("DBMGMT: ", { data, connected });
    if (connected) {
      response = await dbmgmt.runQuery(args);
    } else response = await delayedQuery(args);
    ws.send(JSON.stringify({ queryId: args.queryId, reply: response }));
  });

  // Closing connection
  ws.on("close", async code => {
    clearInterval(pingInt);
    await dbmgmt.close();
    connected = false;
  });
});

router.use((req, res, next) => next());

export default router;
