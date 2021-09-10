import { sign } from 'jsonwebtoken';
if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('Please give a secret for jwt');
// Login handler
export default function authenticate(user: string, pwd: string): Promise<false | string> {
  return new Promise((resolve, reject) => {
    const uuid = '15c63674aba6cdb6252fa92fce24568bbf39033783e12a';
    sign({ user, uuid }, process.env.ACCESS_TOKEN_SECRET!, (err: any, token: any) => resolve(token));
  });
}
