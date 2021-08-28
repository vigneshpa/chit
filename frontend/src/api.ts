/**
 * This file is a common module used to fetch information from the api server
 * or to perform operations locally on the browser storage
 *
 * This is made as a seperate file to isolate api from other frontend code
 */
import type { Actions, CoreClass } from './Core';
import { retrocycle } from './cycle';

type actionFunction = <K extends keyof Actions>(action: K, params: Parameters<Actions[K]>[0]) => ReturnType<Actions[K]>;

let checkLoggedIn: () => void;
let action: actionFunction;

if (window.useLocalCore) {
  checkLoggedIn = () => true;
  let core: Promise<CoreClass> = (async () => await (await import(/* webpackChunkName: "core" */ './Core')).initCore())();
  //@ts-ignore
  action = async (action, params) => await (await core).actions[action](params);
} else {
  const actionURL = window.apiURL + '/action';
  let isRedirecting = false;

  checkLoggedIn = () => {
    if (window.useLocalCore) return true;
    if (isRedirecting) return;
    fetch('/api/login').then(async res => {
      if (res.status !== 200 || (await res.json()) !== 'LOGGED_IN') {
        isRedirecting = true;
        alert('You are not signed in.\nPlease sign in.');
        window.location.href = '/login.html?page=' + window.location.href;
      }
    });
  };
  //@ts-ignore
  action = async (action, params) => {
    params = params ?? {};
    const res = await fetch(actionURL, {
      method: 'POST',
      body: JSON.stringify({ action, params }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 500) return false;
    if (res.status !== 200) return checkLoggedIn();
    const body = await res.json();
    return retrocycle(body);
  };
}
export { checkLoggedIn, action };
