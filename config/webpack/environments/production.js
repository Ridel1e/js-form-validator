/**
 * Created by ridel1e on 23/09/16.
 */

'use strict';

const webpack = require('webpack');
const commonPlugins = require('../common-plugins');

module.exports = {
  plugins: commonPlugins
    .concat([
      new webpack.optimize.UglifyJsPlugin({
        warnings: false,
        drop_console: true,
        unsafe: true
      })
    ])
};