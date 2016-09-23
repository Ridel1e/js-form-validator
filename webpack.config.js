/**
 * Created by ridel1e on 21/09/16.
 */

'use strict';

const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './index.js',

  output: {
    path: __dirname + '/dist',
    filename: 'form-validator.js',
    library: 'formValidator',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV === 'development' ? "cheap-inline-module-source-map": null,

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: __dirname + '/node_modules',
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
};

if(NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      warnings: false,
      drop_console: true,
      unsafe: true
    })
  );
}