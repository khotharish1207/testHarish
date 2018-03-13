'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
require('es6-promise').polyfill();

const ENV = require('./env');
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'www')
};

console.log(ENV);

const common = {
  entry: {
    // vendor: [
    //     'react',
    //     'react-router'
    //   ],
    bundle: [
        path.join(PATHS.src, 'index.jsx')
      ]
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        loader: "url?limit=100000&name=[name].[ext]"
      },
      { 
        test: /\.css$/,
        loader: "style-loader!css-loader" 
      },
      {
        test: /\.(woff2|eot|woff|otf|ttf)$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.jsx?$/,
        loader: 'babel?cacheDirectory',
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      inject: "body",
      title: "Neo Smart Blinds",
      favicon: "./src/style/img/logo_N_blue.ico"
    }),
    new webpack.DefinePlugin({
      "_VERSION": JSON.stringify(ENV.version),
      "_DATABASE": JSON.stringify(ENV.database),
      "_PLATFORM": JSON.stringify(ENV.platform),
      "process.env": {
        "NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      }
    })
  ],
  resolve: {
    extensions: ["", ".js", ".jsx", ".css", ".json"]
  }
};

if (ENV.buildType === 'development') {
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: true,
      inline: true,
      host: "0.0.0.0",
      port: ENV.port,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
    debug: true,
    devtool: 'inline-source-map',
    externals: {
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    },
  });

} else if (ENV.buildType === 'phonegap-serve') {
  module.exports = merge(common, {
    debug: true,
    devtool: false,
  });

} else if (ENV.buildType === 'debug-build') {
  module.exports = merge(common, {
    debug: true,
    devtool: 'source-map',
  });

} else {
  if (process.env.NODE_ENV != 'production') {
    throw new Error("NODE_ENV not set to production!");
  }
  module.exports = merge(common, {
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    ],
    debug: false,
    devtool: false,
  });
}
