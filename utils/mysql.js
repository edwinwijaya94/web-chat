// mysql settings
var mysql = require('mysql');

var exports = {};
var pool;

exports.init = function() {
	pool = mysql.createPool({
            connectionLimit : 10,
            host            : 'localhost',
            user            : 'root',
            password        : '',
            database        : 'web_chat'
        });

	console.log('MySQL pool created...');
}

exports.getPool = function() {
	console.log('Get mysql pool...');
	return pool;
}

module.exports = exports;