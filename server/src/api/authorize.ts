import type { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('Please give a secret for jwt');

type pl = {
  user: string;
  uuid: string;
};
// Login handler
export default function authorize(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['authentication_token'] as string | undefined;
  try {
    if (!token) throw new Error('No token');
    verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, data) => {
      if (err) throw err;
      const payload: pl = data as any;
      if (!payload.user || !payload.uuid) throw new Error('invalid payload');
      req.user = payload.user;
      req.uuid = payload.uuid;
      next();
    });
  } catch (e) {
    return res.status(401).render('error', { code: 401, title: 'Forbidden!', message: 'You are not allowed here.' });
  }
}
