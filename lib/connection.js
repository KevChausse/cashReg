var mysql = require('mysql');

// Pour vous connecter à votre base de données, il faut indiquer vos identifiants

var connection = mysql.createConnection({
	host : 'localhost', // renseigner votre hebergeur
	user : 'root', // renseigner votre nom d'utilisateur
	password : 'root', // renseigner le mot de passe
	database : 'cashReg_db' // renseigner le nom de votre base de données
});

module.exports = connection;