//API for user

var express = require('express');
var router = express.Router();
var mysql = require('../utils/mysql').getPool();
var async = require('async');
var uuid = require('node-uuid');

//get user by id
router.get('/' , function(req, res) {
	var id = req.query.id;
	var result;

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([function(callback) {
			connection.query('SELECT * FROM user WHERE id = ?', [id], function(err, rows, fields) {
				if(err) {
					callback(err);
				} else {
					result = rows[0];
					callback(null);
				}
			});		
		}], function(err) {
				connection.release();
				if(err) {
					res.status(500);
					res.json({
						error : err.message
					})
				} else {
					res.json(result);
				}
			}
		);
	});
});

//register new user
router.post('/register' , function(req, res) {
	var user = req.body;
	var result;

	//generate id
	user.id = uuid.v4();

	//check photo url
	if(user.photo_url == "" || user.photo_url == null){
		user.photo_url="http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png"; //default photo
	}

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([
			function(callback) {
				connection.query('INSERT INTO user(id, name, password, photo_url) VALUES(?,?,?,?)', [user.id, user.name, user.password, user.photo_url], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						callback(null);
					}
				});		
			}, 
			function(callback){
				connection.query('SELECT * FROM user WHERE id = ?', [user.id], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result = rows[0];
						callback(null);
					}
				});

			}], function(err) {
				connection.release();
				if(err) {
					res.status(500);
					res.json({
						error : err.message
					})
				} else {
					res.json(result);
				}
			}
		);
	});
});

//login
router.post('/login' , function(req, res) {
	var user = req.body;
	var result;

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([
			function(callback) {
				connection.query('SELECT * FROM user WHERE name = ? AND password = ?', [user.name, user.password], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result = rows[0];
						callback(null);
					}
				});		
			}, 
			function(callback){
				if(result != null){
					connection.query('SELECT * FROM user WHERE id = ?', [result.id], function(err, rows, fields) {
						if(err) {
							callback(err);
						} else {
							result = rows[0];
							callback(null);
						}
					});
				} else {
					callback(null);
				}

			}], function(err) {
				connection.release();
				if(err) {
					res.status(500);
					res.json({
						error : err.message
					})
				} else {
					if(result != null) {
						res.json(result);
					} else {
						res.json({
							error : "Wrong username or password"
						})
					}
				}
			}
		);
	});
});

//get friend list of a user
router.get('/friends' , function(req, res) {
	var id = req.query.id; //user id
	var result = {};
	
	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([function(callback) {
			connection.query('SELECT U.id, U.name, U.photo_url FROM friend F INNER JOIN user U ON F.friend_id = U.id WHERE F.user_id = ?', [id], function(err, rows, fields) {
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
					})
				} else {
					res.json(result);
				}
			}
		);
	});
});

//add a friend, assume friends exist
router.post('/add' , function(req, res) {
	var userId = req.body.user_id; //user id
	var friendId = req.body.friend_id; //user id

	var result;

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([
			function(callback) {
				connection.query('INSERT INTO friend(user_id, friend_id) VALUES(?, ?)', [userId, friendId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						callback(null);
					}
				});		
			},
			function(callback){
				connection.query('INSERT INTO friend(user_id, friend_id) VALUES(?, ?)', [friendId, userId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						callback(null);
					}
				});	
			},
			function(callback){
				//return friends info
				connection.query('SELECT id, name, photo_url FROM user WHERE id = ?', [friendId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result = rows[0];
						callback(null);
					}
				});	
			}], function(err) {
				connection.release();
				if(err) {
					res.status(500);
					res.json({
						error : err.message
					})
				} else {
					res.json(result);
				}
			}
		);
	});
});

//get group list of a user
router.get('/groups' , function(req, res) {
	var id = req.query.id; //user id
	var result = {};
	
	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([function(callback) {
			connection.query('SELECT id, name FROM groups WHERE user_id = ?', [id], function(err, rows, fields) {
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
					})
				} else {
					res.json(result);
				}
			}
		);
	});
});

module.exports = router;
