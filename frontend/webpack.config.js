const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SveltePreprocess = require('svelte-preprocess');

module.exports = {
  entry: { app: resolve(__dirname, 'src/App.ts') },
  module: {
    rules: [
      {
        test: /\.svelte$/i,
        loader: 'svelte-loader',
        options: {
          preprocess: SveltePreprocess(),
        },
      },
      {
        // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': resolve(__dirname, 'src'),
      '@theme': resolve(__dirname, 'theme'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      scriptLoading: 'defer',
      template: resolve(__dirname, 'src/index.html'),
      chunks: ['app'],
    }),
  ],
  output: {
    filename: 'assets/[name].[chunkhash].js',
    assetModuleFilename: 'assets/[name].[hash][ext][query]',
    path: resolve(__dirname, '../dist/public'),
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devtool: 'source-map',
  devServer: {
    hot: false,
    port: 5000,
  },
};
