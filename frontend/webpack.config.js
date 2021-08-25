const { resolve } = require('path');
const SveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { NormalModuleReplacementPlugin, ProvidePlugin } = require('webpack');

const distPath = typeof process.env.DIST_PATH === 'string' ? process.env.DIST_PATH : './dist';

const isDev = process.env.NODE_ENV === 'development';

const cssLoader = 'css-loader';
const sassLoader = 'sass-loader';
const sourceMapLoader = 'source-map-loader';

const config = [
  {
    entry: { index: '@/App' },
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
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
    output: {
      filename: '[name].js',
      assetModuleFilename: '[name][ext][query]',
      path: resolve(distPath),
      clean: true,
      publicPath: 'auto',
    },
    optimization: {
      minimizer: [`...`, new CssMinimizerPlugin()],
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
  },
  {
    entry: { index: '@/Core' },
    module: {
      rules: [
        {
          test: /\.ts$/i,
          loader: 'ts-loader',
        },
        {
          test: /\.wasm$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.mjs', '.js', '.json'],
      fallback: {
        fs: false,
        path: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'react-native-sqlite-storage': false,
      },
      alias: {
        '@': resolve('src'),
      },
    },
    plugins: [
      new NormalModuleReplacementPlugin(/typeorm$/, function (result) {
        result.request = result.request.replace(/typeorm/, 'typeorm/browser');
      }),
    ],
    output: {
      filename: '[name].js',
      assetModuleFilename: '[name][ext][query]',
      path: resolve(distPath, 'core'),
      clean: true,
      publicPath: 'auto',
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
  },
];
module.exports = config;
