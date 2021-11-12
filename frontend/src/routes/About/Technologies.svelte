<script lang="ts">
  let favs = [
    {
      src: require('./assets/svelte-logo-horizontal.svg'),
      title: 'Svelte Frontend Compiler',
      href: 'https://svelte.dev/',
    },
    {
      src: require('./assets/webpack-logo.svg'),
      title: 'Webpack Module Bundler',
      href: 'https://webpack.js.org/',
    },
    {
      src: require('./assets/Workbox-Logo-Grey.svg'),
      title: 'Google Workbox Libraries',
      href: 'https://developers.google.com/web/tools/workbox',
    },
    {
      src: require('./assets/webassembly.svg'),
      title: 'WebAssembly binary format for predictable performance',
      href: 'https://webassembly.org/',
    },
    {
      src: require('./assets/nodejs-logo.svg'),
      title: 'Node.js JavaScript Runtime',
      href: 'https://nodejs.org/',
    },

    {
      src: require('./assets/Expressjs.png'),
      title: 'Express JS',
      href: 'https://expressjs.com/',
    },
    {
      src: require('./assets/typescript.png'),
      title: 'TypeScript',
      href: 'https://www.typescriptlang.org/',
    },
    {
      src: require('./assets/electron.svg'),
      title: 'Electron JS Desktop GUI Framework',
      href: 'https://www.electronjs.org/',
    },
    {
      src: require('./assets/sqlite.png'),
      title: 'SQLite Database Management System',
      href: 'https://www.sqlite.org/index.html',
    },
  ];
</script>

<template>
  <div class="root">
    <div class="grd">
      {#each favs as fav}
        <div on:click={() => window.open(fav.href)}>
          <img src={fav.src} alt={fav.title} title={fav.title} />
        </div>
      {/each}
    </div>
    <div class="footer">and many more ...</div>
  </div>
</template>

<style>
  .root > .grd {
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    justify-content: space-evenly;
  }
  @media screen and (max-width: 99rem) {
    .root > .grd {
      grid-template-columns: auto auto;
    }
  }
  @media screen and (max-width: 66rem) {
    .root > .grd {
      grid-template-columns: auto;
    }
  }
  .root > .grd > div {
    margin: 4rem;
    height: 6rem;
    width: 25rem;
    overflow: hidden;
    text-align: center;
    transition: transform 0.2s ease;
    cursor: pointer;
  }
  .root > .grd > div:hover {
    transform: scale(1.2);
  }
  .root > .grd > div:active {
    transform: scale(1.1);
  }
  .root > .grd > div > img {
    max-height: 6rem;
    max-width: 25rem;
  }
  .root {
    text-align: center;
  }
</style>
