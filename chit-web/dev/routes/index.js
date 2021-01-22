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
router.use(express_1.static(path_1.join(__dirname, (process.env.NODE_ENV !== "production" ? "../../src/public" : "../public"))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQW9EO0FBQ3BELCtCQUErQztBQUMvQywrQkFBNEI7QUFDNUIsK0JBQXdCO0FBRXhCLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztBQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxhQUFHLENBQUMsQ0FBQztBQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtJQUM1QyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUMsQ0FBQztBQUVILGlCQUFpQjtBQUNqQixNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFPLENBQUMsV0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWpILG9CQUFvQjtBQUNwQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVk7SUFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNyQyxPQUFPLEVBQUUsV0FBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQztRQUM1QyxPQUFPLEVBQUUsR0FBRztLQUNmLENBQUMsQ0FBQyxDQUFDO0FBRVIsMENBQTBDO0FBQzFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsS0FBSyxNQUFNLEVBQUU7SUFDL0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1FBQ2pELE1BQU0sT0FBTyxHQUFtQjtZQUM1QixxQkFBcUI7WUFDckIsSUFBSSxFQUFFLFdBQVc7WUFDakIscUJBQXFCO1lBQ3JCLElBQUksRUFBRSxJQUFJO1lBQ1YscUJBQXFCO1lBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLGlCQUFpQjtZQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsa0JBQWtCO1lBQ2xCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN4QixDQUFDO1FBRUYsTUFBTSxJQUFJLEdBQUcsY0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNqQyw0QkFBNEI7WUFDNUIsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUM1QixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUN6RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDOUI7YUFDSjtZQUNELElBQUksQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUMxQyxpREFBaUQ7WUFDakQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFaEMsZ0JBQWdCO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDZixDQUFDLENBQUMsQ0FBQztDQUNOO0tBQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLEVBQUU7SUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGdCQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0NBQzFEO0FBRUQsa0JBQWUsTUFBTSxDQUFDIn0=