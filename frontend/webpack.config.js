const { resolve } = require('path');
const SveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { NormalModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const distPath = process.env.DIST_PATH ?? '../pages/docs';

if (typeof process.env.NODE_ENV !== 'string') process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV === 'development';

const cssLoader = 'css-loader';
const sassLoader = 'sass-loader';
const sourceMapLoader = 'source-map-loader';
const pPath = isDev ? '/' : '/chitapp/';

const cssPlugin = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;

const plugins = [];
plugins.push(
  new NormalModuleReplacementPlugin(/typeorm$/, function (result) {
    result.request = result.request.replace(/typeorm/, 'typeorm/browser');
  }),
  new CopyPlugin({
    patterns: [
      { from: 'icons/generated', to: 'icons' },
      { from: 'webmanifest.js', to: 'manifest.webmanifest', transform: content => require('./webmanifest')(pPath) },
    ],
  }),
  new HtmlWebpackPlugin({
    inject: 'head',
    minify: true,
    template: resolve('index.html'),
    scriptLoading: 'defer',
    publicPath: pPath,
  })
);
if (!isDev)
  plugins.push(
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    new GenerateSW({
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: 'index.html',
      exclude: [/^.*icons\/.*$/, /\.map$/],
    })
  );
const config = {
  entry: { app: '@/App' },
  module: {
    rules: [
      {
        test: /\.svelte$/i,
        loader: 'svelte-loader',
        options: {
          preprocess: SveltePreprocess(),
          emitCss: !isDev,
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
        use: [cssPlugin, cssLoader, sassLoader],
      },
      {
        test: /\.css$/i,
        use: [cssPlugin, cssLoader, sourceMapLoader],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.wasm$/i,
        type: 'asset/resource',
      },
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    alias: {
      '@': resolve('src'),
      '@theme': resolve('theme'),
      '@core': resolve('../core/src'),
    },
    fallback: {
      fs: false,
      path: false,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      'react-native-sqlite-storage': false,
    },
  },
  plugins,
  output: {
    filename: 'js/[name].js',
    assetModuleFilename: 'assets/[name][ext][query]',
    path: resolve(distPath),
    clean: true,
    publicPath: 'auto',
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devtool: isDev ? 'eval-source-map' : 'source-map',
  cache: {
    type: 'filesystem',
    cacheDirectory: resolve('webpack-cache'),
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
  },
};
module.exports = config;
