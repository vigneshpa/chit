import { Router, static as estatic } from 'express';
import { join } from 'path';
import api from "./api";

const router = Router();

router.use('/api', api);
router.use("/500error", function (req, res, next) {
    next(Error("Broken"));
});

//mounting public
router.use(estatic(join(__dirname, "../public")));

//mounting pug files if developement
if (process.env.NODE_ENV !== 'production')
    router.use(require("express-pug-static")({
        baseDir: join(__dirname, '../static'),
        baseUrl: '/'
    }));
//mounting renderer
if (process.env.NODE_ENV !== "production" && process.env.RENDERER_PATH) {
    const renderer:string = process.env.RENDERER_PATH;
    console.log("Serving app from ", renderer);
    router.use("/app", estatic(renderer));
}

export default router;