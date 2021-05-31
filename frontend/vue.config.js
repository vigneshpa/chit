const { v4 } = require("uuid");
module.exports = {

  devServer: {
    hot: true,
    port: 8000,
    publicPath: "/app/",
    proxy: {
      "/*":{
        target: "http://localhost:3000",
        secure: false,
        ws: true
      }
    }
  },

  //Test comment
  outputDir: "./dist/",

  publicPath: "/app/",
  pwa: {
    name: "Chit App",
  },
  productionSourceMap: false
};