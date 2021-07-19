// Loading theme
import TTheme from '@theme/';

const theme = new TTheme();

// Loading router
import navaid from 'navaid';
import type { Router } from 'navaid';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

window.route = {
  router: navaid('/app'),
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
    app: typeof app;
    route: {
      router: Router;
      pageStr: Writable<string>;
      params: Writable<any>;
      isLoading: Writable<boolean>;
    };
  }
}
