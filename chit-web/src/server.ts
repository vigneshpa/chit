import debug from "debug";
import * as http from "http";
import * as dotenv from "dotenv";
import * as socket from "ws";
import { Dbmgmt } from "chit-common";
import chitDb from "./sqlite3";
debug("test:server");

dotenv.config({
    path: "./.env"
});

import App from "./app";

const port = normalizePort(process.env.PORT || 3000);

const app = new App();

app.app.set("port", port);

const server = http.createServer(app.app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const wss = new socket.Server({ server });
const db = new chitDb();
const dbmgmt = new Dbmgmt("./main.db", db);
let connected = false
wss.on("connection", (ws, req) => {
    console.log(req.url);
    if (req.url == "/api/dbmgmt") {
        if (!connected) new Promise(async (resolve) => {
            let connectionRet = await dbmgmt.connect();
            if(connectionRet){
                connected = true;
            }
        });
        ws.on("message", async (data: string) => {
            let request = JSON.parse(data);
            let response = await dbmgmt.runQuery(request.query, ...request.args);
            ws.send(JSON.stringify({queryId:request.queryId, reply:response}));
        });
        ws.on("close",async (code, reason) => {
            await dbmgmt.closeDB();
            connected = false;
        });
    }
});





//Functions
function normalizePort(val: any): number | boolean {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Listening on ' + bind);
}
