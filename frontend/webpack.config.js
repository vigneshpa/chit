const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SveltePreprocess = require('svelte-preprocess');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EnvironmentPlugin } = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

process.env.DIST_PATH = typeof process.env.DIST_PATH === 'string' ? process.env.DIST_PATH : './dist';

const isDev = process.env.NODE_ENV === 'development';

const cssLoader = 'css-loader';
const sassLoader = 'sass-loader';
const sourceMapLoader = 'source-map-loader';

const config = {
  entry: { app: '@/App.ts' },
  module: {
    rules: [
      {
        test: /\.svelte$/i,
        loader: 'svelte-loader',
        options: {
          preprocess: SveltePreprocess(),
          emitCss: true,
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
      svelte: resolve('node_modules', 'svelte'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css',
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      scriptLoading: 'defer',
      template: resolve(__dirname, 'src/index.html'),
    }),
  ],
  output: {
    filename: 'assets/[name].js',
    assetModuleFilename: 'assets/[name][ext][query]',
    path: resolve(__dirname, process.env.DIST_PATH),
    clean: true,
    publicPath: 'auto',
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devtool: isDev ? 'eval-source-map' : 'source-map',
  devServer: {
    hot: false,
    port: 5000,
    historyApiFallback: true,
  },
};
module.exports = config;
