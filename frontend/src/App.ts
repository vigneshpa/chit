if (window.location.protocol == 'http:' && process.env.NODE_ENV === 'production' && !window.disableSecureRedirect) {
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

if (window.useLocalCore && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(new URL(pPath + 'service-worker.js'), { scope: pPath.href })
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
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
    disableSecureRedirect: true | undefined;
  }
}
