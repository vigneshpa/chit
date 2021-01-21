"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer = require("multer");
const chitCore_1 = require("chitCore");
const upload = multer();
const router = express_1.Router();
router.post("/login", upload.none(), function (req, res, next) {
    var _a;
    if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.loggedIn) {
        next();
        return;
    }
    if (req.body.user === "admin" && req.body.pwd === "admin") {
        req.session.user = {
            loggedIn: true,
            name: "admin"
        };
        res.status(200).json("LOGGED_IN");
    }
    else {
        res.status(401).json("LOGIN_FAILED");
    }
});
router.use(function auth(req, res, next) {
    var _a;
    if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.loggedIn) {
        next();
        return;
    }
    res.status(401).render("error", { code: 401, title: "Forbidden!", message: "You are not allowed here." });
});
router.get("/login", (req, res, next) => res.send("LOGGED_IN"));
router.get("/logout", function (req, res, next) {
    req.session.destroy((err) => {
        if (err)
            throw err;
        res.type('json').status(200).send(JSON.stringify("LOGGED_OUT"));
    });
});
let isPostgress = (process.env.DATABASE_URL) ? true : false;
const pgdbmgmt = new chitCore_1.Dbmgmt({ type: "postgres", url: process.env.DATABASE_URL });
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
    const pingInt = setInterval(() => {
        try {
            ws.ping();
        }
        catch (e) {
            console.log(e);
        }
    }, 5000);
    const user = req.session.user.name;
    let dbmgmt;
    if (isPostgress) {
        dbmgmt = pgdbmgmt;
        await pgconnect();
    }
    else {
        dbmgmt = new chitCore_1.Dbmgmt({ type: "sqlite", database: "./db/" + user + ".db" });
    }
    ws.on("message", async (data) => {
        if (typeof data !== "string")
            return;
        let args = JSON.parse(data);
        let response = await dbmgmt.runQuery(args);
        ws.send(JSON.stringify({ queryId: args.queryId, reply: response }));
    });
    ws.on("close", async (code) => {
        clearInterval(pingInt);
        await dbmgmt.close();
        if (isPostgress)
            pgclose();
    });
});
router.use((req, res, next) => next());
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcy9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUM7QUFDakMsaUNBQWlDO0FBQ2pDLHVDQUFrQztBQUNsQyxNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUN4QixNQUFNLE1BQU0sR0FBRyxnQkFBTSxFQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJOztJQUMzRCxVQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSwwQ0FBRSxRQUFRLEVBQUU7UUFDOUIsSUFBSSxFQUFFLENBQUM7UUFDUCxPQUFPO0tBQ1I7SUFFRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxPQUFPLEVBQUU7UUFDekQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUc7WUFDakIsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUM7UUFDRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNuQztTQUFNO1FBQ0wsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDdEM7QUFFSCxDQUFDLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJOztJQUNyQyxVQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSwwQ0FBRSxRQUFRLEVBQUU7UUFDOUIsSUFBSSxFQUFFLENBQUM7UUFDUCxPQUFPO0tBQ1I7SUFD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