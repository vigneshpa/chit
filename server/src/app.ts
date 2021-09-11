declare namespace Express {
  export interface Request {
    user?: string;
    uuid?: string;
  }
}
import { createServer, Server } from 'http';
import * as express from 'express';
import * as logger from 'morgan';
import * as compression from 'compression';
import { join } from 'path';
import { inspect } from 'util';

import router from './router';
export default class App {
  app: express.Express;
  server: Server;
  private router: express.Router;
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.router = router;

    // Setting up logger
    this.app.use(logger('dev'));

    // Trusting proxy if in production
    // Reditecting to secure if it is in oproduction
    if (process.env.NODE_ENV === 'production') {
      this.app.set('trust proxy', true);
      this.app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] === 'http') {
          res.redirect(307, `https://${req.hostname + req.originalUrl}`);
        } else next();
      });
    }

    // Compression
    this.app.use(compression());

    // Setting up view engine
    this.app.set('views', join(__dirname, './views'));
    this.app.set('view engine', 'pug');

    // Setting up request parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    // Adding router
    this.app.use('/', router);

    // Handle 404
    this.app.use(function (req, res) {
      res.status(404).render('error', { code: 404, title: 'Oops!', message: 'We are unable to find this page. You might want to check the url.' });
    });

    // Handle 500
    this.app.use(function (error: Error, req: any, res: any, next: any) {
      console.error(error);
      res
        .status(500)
        .render('error', { code: 500, title: 'Sorry!', message: 'Some unrecoverable error happened.Please contact us.', details: inspect(error) });
    });
  }
}
