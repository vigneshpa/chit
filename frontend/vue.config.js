module.exports = {
    outputDir: "./../app/windows/",
    publicPath: "./",
    configureWebpack: {
      externals: {
        ipcrenderer: {
          root: "ipcrenderer"
        }
      },
      target:"electron-renderer"
    },
    pages: {
      index: {
        entry: 'src/index/main.ts',
        template: 'public/index.html',
        filename: 'index.html',
        // when using title option,
        // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
        title: 'Index Page',
        // chunks to include on this page, by default includes
        // extracted common chunks and vendor chunks.
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      },
      // when using the entry-only string format,
      // template is inferred to be `public/subpage.html`
      // and falls back to `public/index.html` if not found.
      // Output filename is inferred to be `subpage.html`.
      subpage: 'src/subpage/main.ts'
    }
  };
  