var rabbitmq = require('../utils/rabbitmq');
var mysql = require('../utils/mysql').getPool();
var async = require('async');
var socket = require('../utils/socket');

var exports = {};

exports.init = function(){
	var connection = rabbitmq.getConnection();

    if (connection) {
		connection.exchange('chat_controller', options = {type: 'direct', confirm: true}, function (exchange) {
			connection.queue('group_chat', function (q) {
		  		q.bind(exchange, 'group_chat', function(){
		    		q.subscribe(function (message) {
		      			var data = message;

		      			var res = {};

		      			mysql.getConnection(function(err, connection){
						    if (err) {
						      res = err;
						      return;
						    }

					      	async.series([function(callback){
						        connection.query('INSERT INTO group_chat(group_id, user_id, date_time, chat, status) VALUES(?, ?, NOW(), ?, ?)', [data.group_id, data.user_id, data.chat, 'unread'], function(err, rows, fields) {
									if (err) {
										callback(err)
									} else {
										callback(null)
									}
						        });
					      	}], function(err){
							        connection.release();

							        if (err) {
							          	res = err;
							        } else {
										res = {status: "success"};
									}
									console.log("[QUEUE:group_chat] :" + JSON.stringify(res));
									// Temporary for testing
									// socket.broadcast("newFriendChat", [uid, req.params.uid], newChat);
					        	}
					      	);
					    });

		      		});
		      	});
			});
		});
    }         
}

module.exports = exports;
