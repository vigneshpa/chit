module.exports = {
  //Test comment
  outputDir: "./app/renderer/",

  publicPath: "./",

  configureWebpack: {
    externals: {
      ipcrenderer: {
        root: "ipcrenderer",
      },
    },
  },

  pwa: {
    name: "Chit App",
    workboxOptions: {
      additionalManifestEntries: [
        {
          revision: Math.floor(Math.random()*(10**10))+"",
          url: "resources/browserSupport.js",
        },
        {
          revision: Math.floor(Math.random()*(10**10))+"",
          url: "resources/common.css",
        },
        {
          revision: Math.floor(Math.random()*(10**10))+"",
          url: "resources/sql-wasm.wasm",
        },
        {
          revision: Math.floor(Math.random()*(10**10))+"",
          url: "resources/worker.js",
        },
      ],
    },
  },

  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
};
