import App from '@/App.svelte';
import TTheme from '@theme/';

const theme = new TTheme();
const app = new App({target: window.document.body});
window.app = app;


declare global {
  interface Window {
    app: typeof app;
  }
}