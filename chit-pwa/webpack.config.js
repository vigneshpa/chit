var path = require("path");
var webpack = require("webpack");

module.exports = {
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
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    }),
  ],
  resolve: {
    fallback: {
      fs: false,
      path: false,
      tls: false,
      crypto: false,
    },
    extensions: [".ts", ".js", ".json", ".wasm"],
  },
};
