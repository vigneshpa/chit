/**
 * This file is a common module used to fetch information from the api server
 *
 * This is made as a seperate file to isolate api from other frontend code
 */

import { retrocycle } from './cycle';
const apiUrl = '/api/';
const actionURL = apiUrl + 'action';

export const checkLoggedIn = () =>
  fetch('/api/login').then(async res => {
    if (!(res.status === 200 && (await res.json()) === 'LOGGED_IN')) {
      alert('You are not signed in.\nPlease sign in.');
      window.location.href = '/login.html?page=' + window.location.href;
    }
  });
export async function action(action: string, params?: any) {
  params = params || {};
  const res = await fetch(actionURL, {
    method: 'POST',
    body: JSON.stringify({ action, params }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if(res.status !== 200)return checkLoggedIn();
  const body = await res.json();
  return retrocycle(body);
}
