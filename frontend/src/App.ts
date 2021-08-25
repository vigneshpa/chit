// Checking weather logged in
import { checkLoggedIn } from './api';
checkLoggedIn();

// registering burl
window.bURL = window.bURL || process.env.BASE_URL || '/app';

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
     * App instance
     */
    app: typeof app;
  }
}
