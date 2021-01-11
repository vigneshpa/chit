const { join } = require("path");

module.exports = {
  entry: {
    browserSupport:"./browserSupport/src/browserSupport.ts",
    "browser.worker":"./browserSupport/src/browser.worker.ts",
  },
  output: {
    filename:"[name].js",
    path: join(__dirname, "src/public/app/resources/"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
