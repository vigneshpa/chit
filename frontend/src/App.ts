if (window.location.protocol == 'http:' && process.env.NODE_ENV === 'production' && !window.disableSecure) {
  window.document.body.innerText = 'Redirecting to secure';
  window.location.href = window.location.href.replace('http:', 'https:');
}

// Checking weather logged in
import { checkLoggedIn } from './api';
import type App from './App.svelte';
checkLoggedIn();

declare const __webpack_public_path__: string;
const pPath = new URL(__webpack_public_path__);

// registering burl
window.bURL = window.bURL ?? pPath.href.substring(pPath.origin.length, pPath.href.length - 1);
// registering apiURL
window.apiURL = window.apiURL ?? '/api';

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
    disableSecure: true | undefined;
  }
}
