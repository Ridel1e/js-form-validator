/**
 * Created by ridel1e on 23/09/16.
 */

'use strict';

const commonPlugins = require('../common-plugins');

module.exports = {
  devtool: "cheap-inline-module-source-map",

  watch: true,

  watchOptions: {
    aggregateTimeout: 100
  },

  plugins: commonPlugins
};