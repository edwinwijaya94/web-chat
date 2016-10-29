//API for user

var express = require('express');
var router = express.Router();
var mysql = require('../utils/mysql').getPool();
var async = require('async');
var uuid = require('node-uuid');

//get user by id
router.get('/user/:id' , function(req, res) {
	var id = req.params.id;
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
	if(user.photoUrl == ""){
		user.photoUrl="http://www.iconsfind.com/wp-content/uploads/2015/08/20150831_55e46ad551392.png"; //default photo
	}
	console.log(user);
	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		}

		async.series([
			function(callback) {
				connection.query('INSERT INTO user(id, name, password, photo_url) VALUES(?,?,?,?)', [user.id, user.name, user.password, user.photoUrl], function(err, rows, fields) {
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

module.exports = router;