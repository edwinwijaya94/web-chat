var app = require('../app');

var exports = {};

exports.broadcast = function(topic, ids, message, callback){
	for (var i=0; i<ids.length; i++) {
        var clientSocket = app.get('clientSocket')[ids[i]];
        if (clientSocket) {
            clientSocket.emit(topic, message);
        }
    }
}

module.exports = exports;
