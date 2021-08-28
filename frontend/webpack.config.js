const { resolve } = require('path');
const SveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { NormalModuleReplacementPlugin } = require('webpack');

const distPath = process.env.DIST_PATH ?? './dist';

const isDev = process.env.NODE_ENV === 'development';

const cssLoader = 'css-loader';
const sassLoader = 'sass-loader';
const sourceMapLoader = 'source-map-loader';

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
        use: [MiniCssExtractPlugin.loader, cssLoader, sassLoader],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, cssLoader, sourceMapLoader],
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
  plugins: [
    new NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, 'typeorm/browser');
    }),
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
  ],
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
};
module.exports = config;
