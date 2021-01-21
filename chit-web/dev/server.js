"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const dotenv = require("dotenv");
debug_1.default("test:server");
dotenv.config({
    path: "./.env"
});
const app_1 = require("./app");
const port = normalizePort(process.env.PORT || 3000);
const app = new app_1.default();
app.app.set("port", port);
const server = app.server;
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//Functions
function normalizePort(val) {
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
function onError(error) {
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
    debug_1.default('Listening on ' + bind);
    console.log('Listening on ' + bind);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQjtBQUMxQixpQ0FBaUM7QUFDakMsZUFBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRXJCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDVixJQUFJLEVBQUUsUUFBUTtDQUNqQixDQUFDLENBQUM7QUFFSCwrQkFBd0I7QUFFeEIsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDO0FBRXJELE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7QUFFdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBRTFCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFFMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUlwQyxXQUFXO0FBQ1gsU0FBUyxhQUFhLENBQUMsR0FBUTtJQUMzQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRTdCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2IsYUFBYTtRQUNiLE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUFFRCxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7UUFDWCxjQUFjO1FBQ2QsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFLO0lBQ2xCLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDNUIsTUFBTSxLQUFLLENBQUM7S0FDZjtJQUVELElBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVE7UUFDL0IsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJO1FBQ2hCLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBRXJCLHVEQUF1RDtJQUN2RCxRQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUU7UUFDaEIsS0FBSyxRQUFRO1lBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsK0JBQStCLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU07UUFDVixLQUFLLFlBQVk7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1lBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTTtRQUNWO1lBQ0ksTUFBTSxLQUFLLENBQUM7S0FDbkI7QUFDTCxDQUFDO0FBRUQsU0FBUyxXQUFXO0lBQ2hCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1QixJQUFJLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRO1FBQy9CLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSTtRQUNoQixDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDMUIsZUFBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUN4QyxDQUFDIn0=