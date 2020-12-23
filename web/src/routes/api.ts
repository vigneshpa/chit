import { Router } from 'express';

const router = Router();

router.use('/v1', function(req, res, next){
    res.end("v1 api");
});

router.use("/", function(req, res, next){
    res.status(404);
});

export default router;
