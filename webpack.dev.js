/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'development',

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  devServer: {
    contentBase: './dist',
    compress: true,
    port: 9000,
    historyApiFallback: true,
    public: 'local.pieroni.it'
  },

  plugins: [
    new Dotenv(),
  ],
})