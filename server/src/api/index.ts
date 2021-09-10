import { Router } from 'express';
import { decycle } from '../thirdparty/cycle';
import authorize from './authorize';
import Core from '../../../core/src';
import * as multer from 'multer';
import authenticate from './authenticate';
import * as cookieParser from 'cookie-parser';
const upload = multer();

const router = Router();
router.use(cookieParser());

//Authenticating
router.post('/login', upload.none(), async (req, res, next) => {
  if (!req.body.user || typeof req.body.user !== 'string') return next();
  if (!req.body.pwd || typeof req.body.pwd !== 'string') return next();
  const token = await authenticate(req.body.user, req.body.pwd);
  if (token) {
    const date = new Date();
    res.cookie('authentication_token', token, {
      httpOnly: true,
      sameSite: true,
      expires: new Date(date.setMonth(date.getMonth() + 1)),
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json('LOGGED_IN');
  } else {
    res.status(401).json('LOGIN_FAILED');
  }
});

// Forbidden region
router.use(authorize);

router.get('/login', (req, res, next) => res.status(200).json('LOGGED_IN'));

router.get('/logout', (req, res, next) => {
  res.clearCookie('authentication_token');
  res.redirect(303, '/');
});

// Endpoint handler
router.post('/action', async (req, res, next) => {
  if (typeof req.body.action !== 'string')
    return res.status(400).render('error', { code: 400, title: 'Bad request', message: 'Action specified is not a string' });
  const action: any = req.body.action;
  const params: any = req.body.params;
  const schema: string = req.user || 'test';

  const core = new Core();
  try {
    await core.connect({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      schema,
      name: (req.user || 'test') + Math.floor(Math.random() * 1000),
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
