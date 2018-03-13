'use strict'

let env = {
  platform: process.env.npm_package_config_platform,
  version: process.env.npm_package_version,
  port: process.env.npm_package_config_port,
  database: process.env.npm_package_config_database,
};

const TARGET = process.env.npm_lifecycle_event;

switch (TARGET) {
  case 'start':
  case 'test':
    env.buildType = 'development';
    break;
  case 'serve':
    env.buildType = 'phonegap-serve';
    process.env.NODE_ENV = 'production';
    process.env.BABEL_ENV = 'production';
    break;
  case 'build':
  case 'prepare':
    if (process.env.npm_package_config_debugBuild) {
      console.warn('WARNING ---- DEBUG BUILD SELECTED ----');
      env.buildType = 'debug-build';
      process.env.BABEL_ENV = 'production';
    } else {
      env.buildType = 'production';
      process.env.NODE_ENV = 'production';
      process.env.BABEL_ENV = 'production';
      if (env.database === 'development') {
        console.warn('WARNING ---- DEVELOPMENT DATABASE SELECTED ----');
      }
    }
    break;
  default:
    console.log('Warning: build type not set in env.js');
}

// console.log('Environment: ', env);

module.exports = env;
