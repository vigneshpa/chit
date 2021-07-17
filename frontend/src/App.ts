import App from './App.svelte';
const app = new App({
  target: document.body,
  props: {
    // we'll learn about props later
    answer: 42,
  },
});
window.app = app;


declare global {
  interface Window {
    app: any;
  }
}