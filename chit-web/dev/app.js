"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const logger = require("morgan");
//import * as compression from "compression";
const util_1 = require("util");
const expressws = require("express-ws");
const http = require("http");
const cors = require("cors");
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
        //Configuring cors
        this.app.use(cors());
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
        this.app.set("views", process.env.NODE_ENV === "production" ? "./views" : "../src/views");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyw2QkFBNkI7QUFDN0IsaUNBQWlDO0FBQ2pDLDZDQUE2QztBQUM3QywrQkFBK0I7QUFDL0Isd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFFN0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFDdEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUN6QyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxrQ0FBa0MsQ0FBQyxDQUFDO0FBQzNHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztBQUN6QyxxQ0FBOEI7QUFDOUIsbURBQTRDO0FBQzVDLE1BQU0sR0FBRztJQUtMO1FBRUksSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyx1QkFBYSxDQUFDO1FBRW5DLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixrQkFBa0I7UUFDbEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUVyQixtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFNUIsK0NBQStDO1FBQy9DLDRDQUE0QztRQUM1QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDNUIsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssTUFBTSxFQUFFO2dCQUM3QyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7YUFDbEU7O2dCQUFNLElBQUksRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsdUJBQXVCO1FBQ3ZCLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsd0JBQXdCO1FBQ3hCLDhCQUE4QjtRQUU5Qix3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbkMsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXRELDBCQUEwQjtRQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFHakMsZUFBZTtRQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnQkFBTSxDQUFDLENBQUM7UUFFMUIsYUFBYTtRQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUc7WUFDM0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxtRUFBbUUsRUFBRSxDQUFDLENBQUM7UUFDakosQ0FBQyxDQUFDLENBQUM7UUFFSCxhQUFhO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFZLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1lBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsc0RBQXNELEVBQUUsT0FBTyxFQUFFLGNBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUosQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFDRCxrQkFBZSxHQUFHLENBQUMifQ==