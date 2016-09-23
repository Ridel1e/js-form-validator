/**
 * Created by ridel1e on 23/09/16.
 */

'use strict';

module.exports = (__dirname, fileName) => {
  return {
    entry: './index.js',

    output: {
      path: __dirname + '/dist',
      filename: fileName,
      library: 'formValidator',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },

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
  }
};