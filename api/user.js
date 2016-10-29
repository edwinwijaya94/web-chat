//API for user

var express = require('express');
var router = express.Router();
var mysql = require('../utils/mysql').getPool();
var async = require('async');

//get user by id
router.get('/user/:id' , function(req, res) {
	var id = req.params.id;
	var result;

	mysql.getConnection(function(err, connection) {
		if(err){
			res.json(err);
		} else {
			var result;
		}

		async.series([function(callback) {
			connection.query('SELECT name,photo_url FROM user WHERE id = ?', [id], function(err, rows, fields) {
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