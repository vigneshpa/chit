module.exports = {
    outputDir: "./../app/windows/main",
    publicPath: "./",
    configureWebpack: {
      externals: {
        ipcrenderer: {
          root: "ipcrenderer"
        },
        target:"electron-renderer"
      }
    }
  };
  