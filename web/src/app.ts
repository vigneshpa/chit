import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as session from "express-session";

import router from "./routes";
import { inspect } from "util";
class App {
    vueProjectLocation: string;
    app: express.Application;
    sessionParser: express.RequestHandler;
    //user to uuid map
    map: Map<string, string>;
    constructor() {
        this.vueProjectLocation = path.join(__dirname, process.env.VUEPATH || '../../main/app/windows');
        this.app = express();
        this.sessionParser = session({
            saveUninitialized: false,
            secret: '177V1gne$#',
            resave: false
        });
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.sessionParser);

        //setting up view engine
        this.app.set("views", "./views");
        this.app.set("view engine", "pug");

        //mounting public
        this.app.use(express.static(path.join(__dirname, 'public')));

        //mounting vue project
        this.app.use("/app", express.static(this.vueProjectLocation));


        //adding router
        this.app.use('/', router);

        // Handle 404
        this.app.use(function (req, res) {
            res.status(404).render("error", { code: 404, title: "Oops!", message: "We are unable to find this page. You might want to check the url." });
        });

        // Handle 500
        this.app.use(function (error: Error, req, res, next) {
            res.status(500).render("error", { code: 500, title: "Sorry!", message: "Some unrecoverable error happened.Please contact us.", details:inspect(error)});
        });
    }
}
export default App;