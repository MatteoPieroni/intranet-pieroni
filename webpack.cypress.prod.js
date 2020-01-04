/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SMS_API': JSON.stringify(process.env.SMS_API),
      'process.env.ADMIN_USER': JSON.stringify(process.env.ADMIN_USER),
      'process.env.USER': JSON.stringify(process.env.USER),
    }),
  ],
};