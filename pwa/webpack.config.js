const { resolve } = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (config, env) => (
  {
    entry: {"worker.js":"./src/index.worker.ts", "browserSupport.js":"./src/index.dom.ts"},
    output: {
      filename: "resources/[name]",
      path: resolve(__dirname, "app"),
    },
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".js", ".json"],
      fallback: {
        fs: false,
        path: false,
        tls: false,
        crypto: false,
      },
    },
    module: {
      rules: [
        { test: /\.worker\.ts$/, use: [{ loader: "ts-loader", options: { configFile: "tsconfig.json" } }] },
        { test: /\.dom\.ts$/, use: [{ loader: "ts-loader", options: { configFile: "tsconfig.dom.json" } }] },
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        }],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
        result.request = result.request.replace(/typeorm/, "typeorm/browser");
      }),
      new CopyPlugin({
        patterns: [
          {
            from: resolve(__dirname, "node_modules/sql.js/dist/sql-wasm.wasm"),
            to: "./resources/",
          },
          {
            from: resolve(__dirname, "../chit-renderer/app"),
            to: "./"
          }
        ],
      }),
      new webpack.ProvidePlugin({
        "window.SQL": resolve(
          __dirname,
          "node_modules/sql.js/dist/sql-wasm.js"
        ),
        "window.localforage": resolve(
          __dirname,
          "node_modules/localforage/dist/localforage.min.js"
        ),
      }),
    ],
  });
