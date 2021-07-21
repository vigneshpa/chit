import { Writable, writable } from 'svelte/store';
import './index.scss';
const storeDefault = {
  mobile: writable(true) as Writable<boolean>,
  drawer: writable(false) as Writable<boolean>,
  confirm: writable(false) as Writable<boolean>,
};
export type TStore = typeof storeDefault;
export default class TTheme {
  store: TStore;
  constructor() {
    this.store = storeDefault;
    const resizeHandler = () => {
      const isMobile = window.innerWidth < 960;
      this.store.mobile.set(isMobile);
      this.store.drawer.set(!isMobile);
    };
    window.onresize = resizeHandler;
    resizeHandler();
    window.ttheme = this;
  }
}
declare global {
  interface Window {
    ttheme: TTheme;
  }
}
export { default as Confirm } from './Confirm.svelte';
export { default as Container } from './Container.svelte';
export { default as Drawer } from './Drawer.svelte';
export { default as IconText } from './IconText.svelte';
export { default as Nav } from './Nav.svelte';
export { default as Page } from './Page.svelte';
export { default as Loading } from './Loading.svelte';
export { default as Grid } from './Grid.svelte';
