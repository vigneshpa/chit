import { Router } from 'express';
import * as multer from 'multer';
import Core from 'core';
import { decycle } from '../cycle';

const upload = multer();
const router = Router();

function authenticate(user: string, pass: string) {
  // User Authentication code goes here

  return true;
}

// Login handler
router.post('/login', upload.none(), async (req, res, next) => {
  if (req.session.user?.loggedIn) return next();
  if (!req.body.user || typeof req.body.user !== 'string') return next();
  if (!req.body.pwd || typeof req.body.pwd !== 'string') return next();
  if (authenticate(req.body.user, req.body.pwd)) {
    req.session.user = {
      loggedIn: true,
      name: req.body.user,
    };
    res.status(200).json('LOGGED_IN');
  } else {
    res.status(401).json('LOGIN_FAILED');
  }
});

// Forbidden region
router.use((req, res, next) => {
  if (req.session.user?.loggedIn) return next();
  res.status(401).render('error', { code: 401, title: 'Forbidden!', message: 'You are not allowed here.' });
});

router.get('/login', (req, res, next) => res.status(200).json('LOGGED_IN'));

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else res.redirect(303, '/');
  });
});

// User specific handlers

router.post('/action', async (req, res, next) => {
  if (typeof req.body.action !== 'string') res.status(400).render('error', { code: 400, title: 'Cannot handle the request', message: '' });
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
    const resBody = await(<any>core.actions)[action](params);
    await core.close();
    res.json(decycle(resBody));
  } catch (e) {
    await core.close();
    next(e);
  }
});

router.use((req, res, next) => next());
export default router;
