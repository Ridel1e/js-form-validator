/**
 * Created by ridel1e on 23/09/16.
 */

const webpack = require('webpack');

module.exports = [
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  })
];