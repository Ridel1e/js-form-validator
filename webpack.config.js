/**
 * Created by ridel1e on 21/09/16.
 */

'use strict';

const configs = {
  // common configs
  common: require('./config/webpack/common.config'),

  // environment configs
  production: require('./config/webpack/environments/production.config'),
  development: require('./config/webpack/environments/development.config')

};

const getFileName = function (environment) {
  const libName = 'form-validator';

  if(environment === 'development') {
    return `${libName}.js`
  }
  else {
    return `${libName}.min.js`
  }
};

const loadConfig = function () {
  const NODE_ENV = process.env.NODE_ENV || 'development';

  const fileName = getFileName(NODE_ENV);


  return Object.assign({}, configs.common(__dirname, fileName), configs[NODE_ENV]);
};

module.exports = loadConfig();