const { v4 } = require("uuid");
module.exports = {
  //Test comment
  outputDir: "./app/renderer/",

  publicPath: "./",

  configureWebpack: {
    externals: {
      ipcrenderer: {
        root: "ipcrenderer",
      },
    }
  },
  pwa: {
    name: "Chit App",
    workboxOptions: {
      manifestTransforms: [
        originalManifest => {
          const manifest = originalManifest.concat([
            { url: "resources/browserSupport.js", revision: v4() },
            { url: "resources/sql-wasm.wasm", revision: v4() },
            { url: "resources/worker.js", revision: v4() },
          ]);
          // Optionally, set warning messages.
          const warnings = [];
          return { manifest, warnings };
        },
      ],
    },
  },

  transpileDependencies: ["vuetify"],
  productionSourceMap: false
};