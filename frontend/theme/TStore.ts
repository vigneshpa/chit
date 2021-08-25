import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
export default function getStore() {
  const store = getContext<TStore>('ttheme-store');
  if (!store) new Error('Please use this component within app component');
  return store;
}
export type TStore = {
  mobile: Writable<boolean>;
  drawer: Writable<boolean>;
};
