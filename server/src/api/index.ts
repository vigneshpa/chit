import { Router } from 'express';
import { decycle } from '../thirdparty/cycle';
import { gaurd } from './gaurd';
import Core from 'core';

const router = Router();

// Injecting gaurds
gaurd(router);

// Endpoint handler
router.post('/action', async (req, res, next) => {
  if (typeof req.body.action !== 'string')
    return res.status(400).render('error', { code: 400, title: 'Action specified is not a string', message: '' });
  const action: any = req.body.action;
  const params: any = req.body.params;
  const schema: string = req.session.user?.name || 'test';

  const core = new Core();
  try {
    await core.connect({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      schema,
      name: (req.session.user?.name || 'test') + Math.floor(Math.random() * 1000),
      logging: process.env.NODE_ENV === 'development',
    });
    if (typeof (<any>core.actions)[action] !== 'function')
      return res.status(400).render('error', { code: 400, title: 'Action is not a value', message: '' });
    const resBody = await (<any>core.actions)[action](params);
    await core.close();
    res.json(decycle(resBody));
  } catch (e) {
    await core.close();
    next(e);
  }
});

// Sending everything else to 404
router.use((req, res, next) => next());
export default router;
