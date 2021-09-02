declare module '*.svelte' {
  import 'svelte';
}
declare module '*.html' {
  const content: string;
  export default content;
}
declare module '*.wasm' {
  const a: string;
  export default a;
}
