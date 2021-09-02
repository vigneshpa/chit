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

if (window.useLocalCore && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  let swStatus: swStatus;
  window.serviceWorkerStatus = writable('preparing');
  window.serviceWorkerStatus.subscribe(value => (swStatus = value));
  import('register-service-worker').then(register =>
    register.register(new URL(pPath + 'service-worker.js').href, {
      registrationOptions: { scope: pPath.href },
      ready(registration) {
        if (swStatus === 'preparing') window.serviceWorkerStatus!.set('ready');
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
init().then(async e => {
  checkLoggedIn();
  const App = (
    await import(
      /* webpackChunkName: "appComponent" */
      /* webpackMode: "lazy" */
      /* webpackPrefetch: true */
      '@/App.svelte'
    )
  ).default;
  window.app = new App({ target: window.document.body });
});
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
