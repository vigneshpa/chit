if (window.location.protocol == 'http:' && process.env.NODE_ENV === 'production' && !window.disableSecureRedirect) {
  window.document.body.innerText = 'Redirecting to secure';
  window.location.href = window.location.href.replace('http:', 'https:');
}

// Checking weather logged in
import { checkLoggedIn, init } from './coreService';
import type App from './App.svelte';
import { writable, Writable } from 'svelte/store';
type swStatus = 'preparing' | 'downloading' | 'ready' | 'refresh' | 'offline';

declare const __webpack_public_path__: string;
const pPath = new URL(__webpack_public_path__);

// registering burl
window.bURL = window.bURL ?? pPath.href.substring(pPath.origin.length, pPath.href.length - 1);
// registering apiURL
window.apiURL = window.apiURL ?? '/api';

const initApp = () =>
  init().then(async e => {
    checkLoggedIn();
    const App = ( // Lazy loading App to link css automatically
      await import(
        /* webpackChunkName: "appComponent" */
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        '@/App.svelte'
      )
    ).default;
    window.app = new App({ target: window.document.body });
  });

if (window.useLocalCore && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.ready.then(() => initApp());
  // let swStatus: swStatus;
  window.serviceWorkerStatus = writable('preparing');
  // window.serviceWorkerStatus.subscribe(value => (swStatus = value));

  let offlineTimeOut: number | null = null;
  window.addEventListener('offline', e => {
    offlineTimeOut = window.setTimeout(() => {
      window.serviceWorkerStatus!.set('offline');
      console.info('Offline');
      offlineTimeOut = null;
    }, 2000);
  });
  window.addEventListener('online', e => {
    if (offlineTimeOut) window.clearTimeout(offlineTimeOut);
    register();
    console.info('Online');
  });
  register();
} else initApp();
function register() {
  window.navigator.serviceWorker
    .register(new URL(pPath + 'service-worker.js'), { scope: pPath.href })
    .then(registration => {
      window.serviceWorkerStatus!.set('ready');
      registration.addEventListener('updatefound', e => {
        window.serviceWorkerStatus!.set('preparing');
        const installingWorker = registration.installing!;
        installingWorker.addEventListener('statechange', e => {
          switch (installingWorker.state) {
            case 'installing':
              window.serviceWorkerStatus!.set('downloading');
              break;
            case 'activated':
              window.serviceWorkerStatus!.set('refresh');
          }
        });
      });
    })
    .catch(err => console.error(err));
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
    serviceWorkerStatus: Writable<swStatus> | undefined;
  }
}
