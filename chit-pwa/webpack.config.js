const { resolve } = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (config, env) => [
  {
    entry: "./src/index.worker.ts",
    output: {
      filename: "worker.js",
      path: resolve(__dirname, "dist"),
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
      rules: [{ test: /\.ts$/, use: ["ts-loader"] }],
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
        result.request = result.request.replace(/typeorm/, "typeorm/browser");
      }),
      new CopyPlugin({
        patterns: [
          {
            from: resolve(__dirname, "node_modules/sql.js/dist/sql-wasm.wasm"),
            to: "./",
          },
        ],
      }),
      new webpack.ProvidePlugin({
        "window.SQL": resolve(
          __dirname,
          "node_modules/sql.js/dist/sql-wasm.js"
        ),
      }),
    ],
  },
  {
    entry: "./src/index.ts",
    output: {
      filename: "browserSupport.js",
      path: resolve(__dirname, "dist"),
    },
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".js", ".json"],
      fallback: {
        fs: false,
        path: false,
        tls: false,
        crypto: false,
        typeorm: false,
        chitcore: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: "tsconfig.dom.json",
              },
            },
          ],
        },
      ],
    },
    plugins: [new CleanWebpackPlugin()],
  },
];
