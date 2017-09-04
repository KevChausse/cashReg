var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost', // à renseigner
	user : 'root', // à renseigner
	password : 'root', // à renseigner
	database : 'cashReg_db' // à renseigner
});

module.exports = connection;