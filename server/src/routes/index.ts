import { Router, static as estatic } from 'express';
import { join } from 'path';
import api from './api';
import * as historyApiFallback from 'connect-history-api-fallback';

const router = Router();

router.use('/api', api);
router.use('/500error', function (req, res, next) {
  next(Error('Broken'));
});

//Handeling History API
router.use('/app', historyApiFallback());

// Mounting public
router.use(estatic(join(__dirname, '../public')));

// Mounting pug files if developement
if (process.env.NODE_ENV !== 'production')
  router.use(
    require('express-pug-static')({
      baseDir: join(__dirname, '../static'),
      baseUrl: '/',
    })
  );

// Mounting renderer
if (process.env.NODE_ENV !== 'production' && process.env.RENDERER_PATH) {
  const renderer: string = process.env.RENDERER_PATH;
  console.log('Serving app from ', renderer);
  router.use('/app', estatic(renderer));
}

export default router;
