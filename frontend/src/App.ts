if (window.location.protocol == 'http:' && process.env.NODE_ENV === 'production' && !window.disableSecureRedirect) {
  window.document.body.innerText = 'Redirecting to secure';
  window.location.href = window.location.href.replace('http:', 'https:');
}

// Checking weather logged in
import { checkLoggedIn, init } from './coreService';
import type App from './App.svelte';
import { writable, Writable } from 'svelte/store';
import loadingHtml from './loading.html';
export type swStatus = 'preparing' | 'downloading' | 'error' | 'ready' | 'refresh' | 'offline';

declare const __webpack_public_path__: string;
const pPath = new URL(__webpack_public_path__);

// registering burl
window.bURL = window.bURL ?? pPath.href.substring(pPath.origin.length, pPath.href.length - 1);
// registering apiURL
window.apiURL = window.apiURL ?? '/api';
// Creating install event store
const installEvent = writable<Event | null>(null);

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installEvent.set(e);
});

let serviceWorkerStatus: Writable<swStatus> | undefined;

let inited: boolean = false;
const initApp = () => {
  if (inited) return;
  inited = true;
  init().then(async e => {
    serviceWorkerStatus?.set('ready');
    window.document.body.innerHTML = '';
    checkLoggedIn();
    const App = ( // Lazy loading App to link css automatically
      await import(
        /* webpackChunkName: "appComponent" */
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        '@/App.svelte'
      )
    ).default;
    window.app = new App({ target: window.document.body, props: { serviceWorkerStatus, installEvent } });
  });
};

if (window.useLocalCore && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  // If this page is controlled initilise app
  if (navigator.serviceWorker.controller) initApp();
  // let swStatus: swStatus;
  serviceWorkerStatus = writable('preparing');
  // window.serviceWorkerStatus.subscribe(value => (swStatus = value));

  window.addEventListener('offline', e => serviceWorkerStatus!.set('offline'));
  window.addEventListener('online', e => register());
  if (navigator.onLine) {
    register();
  } else {
    serviceWorkerStatus!.set('offline');
  }
} else initApp();
function register() {
  if (!inited)
    // Setting inner html to loading service worker
    window.document.body.innerHTML = loadingHtml;
  window.navigator.serviceWorker
    .register(new URL(pPath + 'service-worker.js'), { scope: pPath.href })
    .then(registration => {
      serviceWorkerStatus!.set('ready');
      registration.addEventListener('updatefound', e => {
        serviceWorkerStatus!.set('downloading');
        const installingWorker = registration.installing!;
        installingWorker.addEventListener('statechange', e => {
          console.log(`Installing worker state ${installingWorker.state}`);
          if (installingWorker.state === 'activated') {
            serviceWorkerStatus!.set('refresh');
            initApp();
          }
        });
      });
    })
    .catch(err => {
      serviceWorkerStatus!.set('error');
      console.error(err);
    });
}
declare global {
  interface Window {
    /**
     * Base url for the app
     */
    bURL: string;
    /**
     * Base url of the api sserver
     */
    apiURL: string;
    /**
     * App instance
     */
    app: App;
    useLocalCore: true | undefined;
    disableSecureRedirect: true | undefined;
  }
}
