// Checking weather logged in
import { checkLoggedIn } from './api';
checkLoggedIn();

// Variables
const bURL = process.env.BASE_URL || '/app';
window.bURL = bURL;

// Loading theme
import TTheme from '@theme/';

const theme = new TTheme();

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
