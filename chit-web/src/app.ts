import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
//import * as compression from "compression";
import { inspect } from "util";
import * as expressws from "express-ws";
import * as http from "http";
import * as cors from "cors";

const app = express();
const server = http.createServer(app);
const appWS = expressws(app, server).app;
const rendererPath = path.join(__dirname, process.env.RENDERER_PATH || '../../chit-renderer/app/renderer');
process.env.RENDERER_PATH = rendererPath;
import router from "./routes";
import sessionParser from "./sessionParser";
class App {
    rendererPath: string;
    app: expressws.Application;
    server: http.Server;
    sessionParser: express.RequestHandler;
    constructor() {

        this.rendererPath = rendererPath;
        this.sessionParser = sessionParser;

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
            } else next();
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
        this.app.use('/', router);

        // Handle 404
        this.app.use(function (req, res) {
            res.status(404).render("error", { code: 404, title: "Oops!", message: "We are unable to find this page. You might want to check the url." });
        });

        // Handle 500
        this.app.use(function (error: Error, req, res, next) {
            res.status(500).render("error", { code: 500, title: "Sorry!", message: "Some unrecoverable error happened.Please contact us.", details: inspect(error) });
        });
    }
}
export default App;