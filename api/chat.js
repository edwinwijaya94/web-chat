var rabbitmq = require('../utils/rabbitmq');
var express = require('express');
var router = express.Router();
var async = require('async');
var socket = require('../utils/socket');
var mysql = require('../utils/mysql').getPool();

//personal chat to other user
router.post('/user', function(req, res) {
  	var data = req.body;

  	var connection = rabbitmq.getConnection();

	if (connection) {
		connection.exchange('chat_controller', options = {type: 'direct', confirm: true}, function (exchange) {
			exchange.publish('personal_chat', data, options = {}, function(transmissionFailed){
				if (transmissionFailed){
				  	res.status(500);
				  	res.json({
				    	error: "chat failed"
				  	});
				}else{
					res.json({
						success: "chat sent to queue"
					});
				}
			})
		});
	}
});

//get chat for specific user and friend
router.get('/user', function(req, res) {
  	var userId = req.query.user_id;
  	var friendId = req.query.friend_id;
  	
  	var result = {};

  	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([function(callback) {
			connection.query('SELECT user.name, C.date_time, chat FROM (SELECT user_id, date_time, chat FROM chat WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?) ) C INNER JOIN user ON user.id = C.user_id ORDER BY C.date_time ASC', [userId, friendId, friendId, userId], function(err, rows, fields) {
				console.log(rows);
				if(err) {
					callback(err);
				} else {
					result.data = rows;
					callback(null);
				}
			});		
		}], function(err) {
				connection.release();
				if(err) {
					res.status(500);
					res.json({
						error : err.message
					});
				} else {
					res.json(result);
				}
			}
		);
	});

});

module.exports = router;
