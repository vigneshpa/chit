// Checking weather logged in
import { checkLoggedIn } from './api';
checkLoggedIn();

// Variables
const bURL = process.env.BASE_URL || '/app';
window.bURL = bURL;

// Loading theme
import TTheme from '@theme/';

const theme = new TTheme();

// Loading router
import navaid from 'navaid';
import type { Router } from 'navaid';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

window.route = {
  router: navaid(bURL),
  pageStr: writable(''),
  params: writable({}),
  isLoading: writable(true),
};

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
    /**
     * Information about current route
     */
    route: {
      /**
       * NavAid router instance
       */
      router: Router;
      /**
       * Current page
       */
      pageStr: Writable<string>;
      /**
       * Parameters of the page
       */
      params: Writable<any>;
      /**
       * Wheather the page is loading
       */
      isLoading: Writable<boolean>;
    };
  }
}
