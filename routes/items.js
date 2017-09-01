var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost', // à renseigner
	user : 'root', // à renseigner
	password : 'root', // à renseigner
	database : 'cashReg_db' // à renseigner
});


connection.connect();


/*
GET items listing   GET /
GET item            GET /ext-id
POST new item       POST /
PUT new item        PUT /
DELETE item         DELETE /ext-id
DELETE items        DELETE /

*/

/* GET items listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
