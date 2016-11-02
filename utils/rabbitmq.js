var amqp = require('amqp');
var connection = null;
var isConnectionReady = false;

var exports = {};

exports.init = function(callback){
    connection = amqp.createConnection({host: "localhost", port: 5672});

    // add this for better debuging
    connection.on('error', function(e) {
        console.log('ERR AMQP : ' + e);
    });

    // Wait for connection to become established.
    connection.on('ready', function () {
        console.log('AMQP Connection ready..');
        isConnectionReady = true;

        callback();
    });
}

exports.getConnection = function(){
    return isConnectionReady ? connection : null;
}

module.exports = exports;