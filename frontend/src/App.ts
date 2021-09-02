if (window.location.protocol == 'http:' && process.env.NODE_ENV === 'production' && !window.disableSecureRedirect) {
  window.document.body.innerText = 'Redirecting to secure';
  window.location.href = window.location.href.replace('http:', 'https:');
}

// Checking weather logged in
import { checkLoggedIn } from './coreService';
import type App from './App.svelte';
import { Writable, writable } from 'svelte/store';
checkLoggedIn();

declare const __webpack_public_path__: string;
const pPath = new URL(__webpack_public_path__);

// registering burl
window.bURL = window.bURL ?? pPath.href.substring(pPath.origin.length, pPath.href.length - 1);
// registering apiURL
window.apiURL = window.apiURL ?? '/api';

if (window.useLocalCore && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.serviceWorkerStatus = writable('preparing');
  import('register-service-worker').then(v =>
    v.register(new URL(pPath + 'service-worker.js').href, {
      registrationOptions: { scope: pPath.href },
      ready(registration) {
        window.serviceWorkerStatus!.set('ready');
      },
      updatefound(registration) {
        window.serviceWorkerStatus!.set('downloading');
      },
      updated(registration) {
        window.serviceWorkerStatus!.set('refresh');
      },
      offline() {
        window.serviceWorkerStatus!.set('offline');
      },
      error(error) {
        console.error('Error during service worker registration:', error);
      },
    })
  );
}
// Lazy loading App to link css automatically
import(
  /* webpackChunkName: "appComponent" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  '@/App.svelte'
).then(App => (window.app = new App.default({ target: window.document.body })));

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
    serviceWorkerStatus: Writable<'preparing' | 'downloading' | 'ready' | 'refresh' | 'offline'> | undefined;
  }
}
