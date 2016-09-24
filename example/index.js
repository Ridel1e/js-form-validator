/**
 * Created by ridel1e on 24/09/2016.
 */

'use strict';

var express, server;

express = require('express');
server = express();


server.set('port', 4000);
server.use(express.static(__dirname));

server.listen(server.get('port'), function () {
  console.log("server listening on port: "
    + server.get('port'));
});