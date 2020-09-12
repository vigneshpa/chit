module.exports = {
  "outputDir": "./../app/windows/",
  "publicPath": "./",
  "configureWebpack": {
    "externals": {
      "ipcrenderer": {
        "root": "ipcrenderer"
      }
    }
  },
  "pages": {
    "index": {
      "entry": "src/index/main.ts",
      "template": "public/index.html",
      "filename": "index.html",
      "title": "Chit Management System",
      "chunks": [
        "chunk-vendors",
        "chunk-common",
        "index"
      ]
    },
    "form":{
        "entry":"src/forms/main.ts",
        "template":"public/forms.html",
        "filename":"forms.html",
        "title":"form"
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}