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

  pwa:{
    name:"Chit App"
  },

  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
};
