const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (config, env) => ({
  entry: "./src/index.ts",
  output: {
    filename: "browserSupport.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    }),
    new CopyPlugin({
      patterns: [
        { from: "node_modules/sql.js/dist/sql-wasm.wasm", to: "./" },
      ],
    }),
  ],
  resolve: {
    fallback: {
      fs: false,
      path: false,
      tls: false,
      crypto: false,
    },
    extensions: [".ts", ".js", ".json"],
  },
});