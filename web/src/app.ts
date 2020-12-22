import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as session from "express-session";

import router from "./routes";
class App {
    vueProjectLocation:string;
    app:express.Application;
    sessionParser:express.RequestHandler;
    map;
    constructor() {
        this.vueProjectLocation = path.join(__dirname, process.env.VUEPATH || '../../main/app/windows');
        this.app = express();
        this.map = new Map();
        this.sessionParser =  session({
            saveUninitialized: false,
            secret: '177V1gne$#',
            resave: false
          });
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.sessionParser);
        this.app.use(express.static(path.join(__dirname, 'public')));

        //mounting vue project
        this.app.use("/app", express.static(this.vueProjectLocation));


        //adding router
        this.app.use('/', router);

        // Handle 404
        this.app.use(function (req, res) {
            res.status(404).send('404: Page not Found');
        });

        // Handle 500
        this.app.use(function (error: Error, req, res, next) {
            res.status(500).send('500: Internal Server Error');
        });
    }
}
export default App;