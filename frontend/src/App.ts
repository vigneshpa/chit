// Checking weather logged in
import { checkLoggedIn } from './api';
checkLoggedIn();

// registering burl
window.bURL = window.bURL || '/app';
// registering apiURL
window.apiURL = window.apiURL || '/api';

// Loading App
import App from '@/App.svelte';

const app = new App({ target: window.document.body });
window.app = app;

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
    app: typeof app;
  }
}
