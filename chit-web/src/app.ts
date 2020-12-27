import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as compression from "compression";

import sessionParser from "./sessionParser";
import router from "./routes";
import { inspect } from "util";
class App {
    rendererPath: string;
    app: express.Application;
    sessionParser: express.RequestHandler;
    //user to uuid map
    map: Map<string, string>;
    constructor() {
        this.rendererPath = path.join(__dirname, process.env.RENDERER_PATH || '../../chit/app/renderer');
        this.sessionParser = sessionParser;

        //Creating app instance
        this.app = express();

        //Setting up Morgan
        this.app.use(logger('dev'));

        //Setting up compression
        this.app.use(compression());

        //setting up view engine
        this.app.set("views", "./views");
        this.app.set("view engine", "pug");

        //mounting public
        this.app.use(express.static(path.join(__dirname, 'public')));
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