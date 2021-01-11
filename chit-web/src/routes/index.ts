import { Router, static as estatic } from 'express';
import { request, RequestOptions } from 'http';
import { join } from 'path';
import api from "./api";

const router = Router();

router.use('/api', api);
router.use("/500error", function (req, res, next) {
    throw Error("Broken");
});

//mounting public
router.use(estatic(join(__dirname, '../public')));

//mounting pug files
if (process.env.NODE_ENV !== 'production')
    router.use(require("express-pug-static")({
        baseDir: join(__dirname, '../static'),
        baseUrl: '/'
    }));

//mounting proxy to vue webpack dev server
if (process.env.USE_PROXY_FOR_RENDERER === 'true') {
    router.use('/app', function vueProxy(oreq, ores, next) {
        const options: RequestOptions = {
            // host to forward to
            host: 'localhost',
            // port to forward to
            port: 8080,
            // path to forward to
            path: oreq.path,
            // request method
            method: oreq.method,
            // headers to send
            headers: oreq.headers,
        };

        const creq = request(options, pres => {
            // setting response headders
            for (const key in pres.headers) {
                if (Object.prototype.hasOwnProperty.call(pres.headers, key)) {
                    const value = pres.headers[key];
                    ores.setHeader(key, value);
                }
            }
            ores.removeHeader("Content-Type-Options");
            // set http status code based on proxied response
            ores.writeHead(pres.statusCode);

            // wait for data
            pres.pipe(ores);
        })

        creq.end();
    });
} else if (process.env.NODE_ENV !== "production") {
    console.log("Serving renderer from ", process.env.RENDERER_PATH);
    router.use("/app", estatic(process.env.RENDERER_PATH));
}

export default router;