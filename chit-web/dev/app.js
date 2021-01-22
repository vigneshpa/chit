"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const logger = require("morgan");
//import * as compression from "compression";
const util_1 = require("util");
const expressws = require("express-ws");
const http = require("http");
const app = express();
const server = http.createServer(app);
const appWS = expressws(app, server).app;
const rendererPath = path.join(__dirname, process.env.RENDERER_PATH || '../../chit-renderer/app/renderer');
process.env.RENDERER_PATH = rendererPath;
const routes_1 = require("./routes");
const sessionParser_1 = require("./sessionParser");
class App {
    constructor() {
        this.rendererPath = rendererPath;
        this.sessionParser = sessionParser_1.default;
        //Adding app and server instance
        this.app = appWS;
        this.server = server;
        //Setting up Morgan
        this.app.use(logger('dev'));
        //Reditecting to secure if it is in oproduction
        //if (process.env.NODE_ENV === 'production')
        this.app.use((req, res, next) => {
            if (req.headers['x-forwarded-proto'] === 'http') {
                res.redirect(307, `https://${req.hostname + req.originalUrl}`);
            }
            else
                next();
        });
        //Setting up websockets
        expressws(this.app);
        //Setting up compression
        //this.app.use(compression());
        //setting up view engine
        this.app.set("views", process.env.NODE_ENV !== "production" ? "../src/views" : "./views");
        this.app.set("view engine", "pug");
        //Setting up request parsers
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        //Injecting session parser
        this.app.use(this.sessionParser);
        //adding router
        this.app.use('/', routes_1.default);
        // Handle 404
        this.app.use(function (req, res) {
            res.status(404).render("error", { code: 404, title: "Oops!", message: "We are unable to find this page. You might want to check the url." });
        });
        // Handle 500
        this.app.use(function (error, req, res, next) {
            res.status(500).render("error", { code: 500, title: "Sorry!", message: "Some unrecoverable error happened.Please contact us.", details: util_1.inspect(error) });
        });
    }
}
exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsaUNBQWlDO0FBQ2pDLDZDQUE2QztBQUM3QywrQkFBK0I7QUFDL0Isd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUU3QixNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ3pDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFJLGtDQUFrQyxDQUFDLENBQUM7QUFDM0csT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ3pDLHFDQUE4QjtBQUM5QixtREFBNEM7QUFDNUMsTUFBTSxHQUFHO0lBS0w7UUFFSSxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsYUFBYSxHQUFHLHVCQUFhLENBQUM7UUFFbkMsZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLG1CQUFtQjtRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUU1QiwrQ0FBK0M7UUFDL0MsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUM1QixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxNQUFNLEVBQUU7Z0JBQzdDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQzthQUNsRTs7Z0JBQU0sSUFBSSxFQUFFLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7UUFFSCx1QkFBdUI7UUFDdkIsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQix3QkFBd0I7UUFDeEIsOEJBQThCO1FBRTlCLHdCQUF3QjtRQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuQyw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdEQsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUdqQyxlQUFlO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGdCQUFNLENBQUMsQ0FBQztRQUUxQixhQUFhO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEVBQUUsR0FBRztZQUMzQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLG1FQUFtRSxFQUFFLENBQUMsQ0FBQztRQUNqSixDQUFDLENBQUMsQ0FBQztRQUVILGFBQWE7UUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQVksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7WUFDL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxzREFBc0QsRUFBRSxPQUFPLEVBQUUsY0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5SixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQUNELGtCQUFlLEdBQUcsQ0FBQyJ9