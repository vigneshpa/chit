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

  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
};
