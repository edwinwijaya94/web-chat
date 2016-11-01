//API for user

var express = require('express');
var router = express.Router();
var mysql = require('../utils/mysql').getPool();
var async = require('async');
var uuid = require('node-uuid');

//get group by id
router.get('/' , function(req, res) {
	var id = req.query.id;
	var result = {};

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([
			function(callback) {
				connection.query('SELECT U.id, U.name, U.photo_url FROM groups G INNER JOIN user U ON G.user_id = U.id WHERE G.id = ?', [id], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result.member = rows;
						callback(null);
					}
				});		
			},
			function(callback) {
				connection.query('SELECT id, name, admin_id FROM groups WHERE id = ? LIMIT 1', [id], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result.id = rows[0].id;
						result.name = rows[0].name;
						result.admin_id = rows[0].admin_id;
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

//create new group
router.post('/create' , function(req, res) {
	var group = req.body;
	var result;
	var memberIds = [];

	//generate id
	group.id = uuid.v4();

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([
			function(callback) {
				//get user id for every member
				for(var i=0; i<group.member.length; i++){
					connection.query('SELECT id FROM user WHERE name = ?', [group.member[i].name], function(err, rows, fields) {
						if(err) {
							callback(err);
							return;
						}
						memberIds.push(rows[0].id);
					});
				}
				var isQueryFinished = function(){
					if(memberIds.length == group.member.length){
						callback(null);
						return;
					}
					setTimeout(isQueryFinished, 50);
				}
				isQueryFinished();
			},
			function(callback) {
				//insert for every member
				for(var i=0; i<memberIds.length; i++){
					connection.query('INSERT INTO groups(id, name, user_id, admin_id) VALUES(?,?,?,?)', [group.id, group.name, memberIds[i], group.admin_id], function(err, rows, fields) {
						if(err) {
							callback(err);
							return;
						}
					});
				}
				callback(null);
			}, 
			function(callback){
				//return group info
				connection.query('SELECT id, name FROM groups WHERE id = ? LIMIT 1', [group.id], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result = rows;
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

//add a member, assume user exist
router.post('/add' , function(req, res) {
	var groupId = req.body.group_id; //group id
	var memberName = req.body.member_name; //member name
	var memberId;
	var groupName;
	var adminId;
	
	var result = {};

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([
			function(callback) {
				//get group name and admin
				connection.query('SELECT id FROM user WHERE name = ?', [memberName], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						memberId = rows[0].id;
						callback(null);
					}
				});		
			},
			function(callback) {
				//get group name and admin
				connection.query('SELECT name, admin_id FROM groups WHERE id = ? LIMIT 1', [groupId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						groupName = rows[0].name;
						adminId = rows[0].admin_id;
						callback(null);
					}
				});		
			},
			function(callback){
				//add new group member
				connection.query('INSERT INTO groups(id, name, user_id, admin_id) VALUES(?, ?, ?, ?)', [groupId, groupName, memberId, adminId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						callback(null);
					}
				});	
			},
			function(callback) {
				//get updated group members
				connection.query('SELECT U.id, U.name, U.photo_url FROM groups G INNER JOIN user U ON G.user_id = U.id WHERE G.id = ?', [groupId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result.member = rows;
						callback(null);
					}
				});		
			},
			function(callback) {
				//get other info of group
				connection.query('SELECT id, name, admin_id FROM groups WHERE id = ? LIMIT 1', [groupId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result.id = rows[0].id;
						result.name = rows[0].name;
						result.admin_id = rows[0].admin_id;
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

//remove a member from group
router.post('/remove' , function(req, res) {
	var groupId = req.body.group_id; //user id
	var memberName = req.body.member_name; //member name
	var memberId;

	var result = {};

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([
			function(callback){
				//remove group member
				connection.query('SELECT id FROM user WHERE name = ?', [memberName], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						memberId = rows[0].id;
						callback(null);
					}
				});	
			},
			function(callback){
				//remove group member
				connection.query('DELETE FROM groups WHERE id = ? AND user_id = ?', [groupId, memberId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						callback(null);
					}
				});	
			},
			function(callback) {
				//get updated group members
				connection.query('SELECT U.id, U.name, U.photo_url FROM groups G INNER JOIN user U ON G.user_id = U.id WHERE G.id = ?', [groupId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result.member = rows;
						callback(null);
					}
				});		
			},
			function(callback) {
				//get other info of group
				connection.query('SELECT id, name, admin_id FROM groups WHERE id = ? LIMIT 1', [groupId], function(err, rows, fields) {
					if(err) {
						callback(err);
					} else {
						result.id = rows[0].id;
						result.name = rows[0].name;
						result.admin_id = rows[0].admin_id;
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
