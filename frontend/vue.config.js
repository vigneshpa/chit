module.exports = {
  "outputDir": "./../app/windows/",
  "publicPath": "./",
  "configureWebpack": {
    "externals": {
      "ipcrenderer": {
        "root": "ipcrenderer"
      }
    },
    "target": "electron-renderer"
  },
  "pages": {
    "index": {
      "entry": "src/index/main.ts",
      "template": "public/index.html",
      "filename": "index.html",
      "title": "Index Page",
      "chunks": [
        "chunk-vendors",
        "chunk-common",
        "index"
      ]
    },
    "subpage": "src/subpage/main.ts"
  },
  "transpileDependencies": [
    "vuetify"
  ]
}