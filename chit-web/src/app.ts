import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as compression from "compression";
import { inspect } from "util";
import * as expressws from "express-ws";
import * as http from "http";

const app = express();
const server = http.createServer(app);
const appWS = expressws(app, server).app;
import router from "./routes";
import sessionParser from "./sessionParser";
class App {
    rendererPath: string;
    app: expressws.Application;
    server:http.Server;
    sessionParser: express.RequestHandler;
    constructor() {
        this.rendererPath = path.join(__dirname, process.env.RENDERER_PATH || '../../chit-renderer/app/renderer');
        this.sessionParser = sessionParser;

        //Adding app and server instance
        this.app = appWS;
        this.server = server;

        //Setting up Morgan
        this.app.use(logger('dev'));

        //Reditecting to secure if it is in oproduction
        this.app.use((req, res, next)=>{
            if(req.headers['x-forwarded-proto'] === 'http'){
                res.redirect(307, `https://${req.hostname+req.originalUrl}`);
            }else next();
        });

        //Setting up websockets
        expressws(this.app);
        //Setting up compression
        this.app.use(compression());

        //setting up view engine
        this.app.set("views", "./views");
        this.app.set("view engine", "pug");

        //mounting public
        this.app.use(express.static(path.join(__dirname, 'public')));

        //mounting pug files
        if (process.env.NODE_ENV !== 'production') {
            const pugStatic = require("express-pug-static");
            this.app.use(pugStatic({
                baseDir: path.join(__dirname, '/static'),
                baseUrl: '/'
            }));
        }

        //Setting up request parsers
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        //Injecting session parser
        this.app.use(this.sessionParser);

        //mounting vue project
        if (process.env.NODE_ENV !== 'production')
            this.app.use("/app", express.static(this.rendererPath));



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