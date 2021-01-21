"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_1 = require("http");
const path_1 = require("path");
const api_1 = require("./api");
const router = express_1.Router();
router.use('/api', api_1.default);
router.use("/500error", function (req, res, next) {
    throw Error("Broken");
});
//mounting public
router.use(express_1.static(path_1.join(__dirname, '../../src/public')));
//mounting pug files
if (process.env.NODE_ENV !== 'production')
    router.use(require("express-pug-static")({
        baseDir: path_1.join(__dirname, '../../src/static'),
        baseUrl: '/'
    }));
//mounting proxy to vue webpack dev server
if (process.env.USE_PROXY_FOR_RENDERER === 'true') {
    router.use('/app', function vueProxy(oreq, ores, next) {
        const options = {
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
        const creq = http_1.request(options, pres => {
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
        });
        creq.end();
    });
}
else if (process.env.NODE_ENV !== "production") {
    console.log("Serving renderer from ", process.env.RENDERER_PATH);
    router.use("/app", express_1.static(process.env.RENDERER_PATH));
}
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQW9EO0FBQ3BELCtCQUErQztBQUMvQywrQkFBNEI7QUFDNUIsK0JBQXdCO0FBRXhCLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztBQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxhQUFHLENBQUMsQ0FBQztBQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtJQUM1QyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUMsQ0FBQztBQUVILGlCQUFpQjtBQUNqQixNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFPLENBQUMsV0FBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUV6RCxvQkFBb0I7QUFDcEIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZO0lBQ3JDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDckMsT0FBTyxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUM7UUFDNUMsT0FBTyxFQUFFLEdBQUc7S0FDZixDQUFDLENBQUMsQ0FBQztBQUVSLDBDQUEwQztBQUMxQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEtBQUssTUFBTSxFQUFFO0lBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtRQUNqRCxNQUFNLE9BQU8sR0FBbUI7WUFDNUIscUJBQXFCO1lBQ3JCLElBQUksRUFBRSxXQUFXO1lBQ2pCLHFCQUFxQjtZQUNyQixJQUFJLEVBQUUsSUFBSTtZQUNWLHFCQUFxQjtZQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixpQkFBaUI7WUFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLGtCQUFrQjtZQUNsQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDeEIsQ0FBQztRQUVGLE1BQU0sSUFBSSxHQUFHLGNBQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDakMsNEJBQTRCO1lBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDNUIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDekQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQzlCO2FBQ0o7WUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDMUMsaURBQWlEO1lBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRWhDLGdCQUFnQjtZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2YsQ0FBQyxDQUFDLENBQUM7Q0FDTjtLQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxFQUFFO0lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxnQkFBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztDQUMxRDtBQUVELGtCQUFlLE1BQU0sQ0FBQyJ9