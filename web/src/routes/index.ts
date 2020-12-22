import { Router } from 'express';
import api from "./api";

const router = Router();

router.use('/api', api);
router.use("/500error", function(req, res, next){
    throw Error("Broken");
});

export default router;