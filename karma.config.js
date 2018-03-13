var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    browsers: [ 'Chrome' ],
    files: [
      './tests/*/*.spec.jsx',
      './tests/*/*.spec.js',
    ],
    frameworks: [ 'mocha', 'chai-spies', 'chai' ],
    plugins: [
      'karma-chrome-launcher',
      'karma-chai',
      'karma-chai-spies',
      'karma-mocha',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      './tests/*/*.spec.jsx': [ 'webpack', 'sourcemap'],
      './tests/*/*.spec.js': [ 'webpack', 'sourcemap'],
    },
    autoWatch: true,
    reporters: [ 'mocha' ],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    }
  });
};