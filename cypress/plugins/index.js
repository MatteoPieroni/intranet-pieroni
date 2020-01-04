const wp = require('@cypress/webpack-preprocessor');

module.exports = (on) => {
  const options = {
    webpackOptions: process.env.ENV === 'local' ?
      require('../../webpack.cypress.dev') :
      require('../../webpack.cypress.prod'),
  }
  on('file:preprocessor', wp(options))
}