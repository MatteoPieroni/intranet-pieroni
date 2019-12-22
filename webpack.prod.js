/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'production',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
      'process.env.AUTH_DOMAIN': JSON.stringify(process.env.AUTH_DOMAIN),
      'process.env.DB_URL': JSON.stringify(process.env.DB_URL),
      'process.env.PROJECT_ID': JSON.stringify(process.env.PROJECT_ID),
      'process.env.STORAGE_BUCKET': JSON.stringify(process.env.STORAGE_BUCKET),
      'process.env.MESSAGING_SENDER_ID': JSON.stringify(process.env.MESSAGING_SENDER_ID),
      'process.env.APP_ID': JSON.stringify(process.env.APP_ID),
    })
  ],
})