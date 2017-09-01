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

DELETE item list    DELETE /

A FAIRE:
    tests des valeurs POST
    tests des valeurs PUT
    tests des valeurs DELETE ind
    tests des valeurs DELETE list

*/

/* GET items listing. */
router.get('/', function(req, res, next) {

    var getItemsList = function(retfunc){
        connection.query('SELECT idext_item, name_item, description_item, value_item, quantity_item FROM item_cashReg', function(error, results, fields) {
            if(error) res.send(error);
            else retfunc(results);
        });
    }

    getItemsList(function(results) {
        res.json(results);
    });

});



/* GET item detail. */
router.get('/:idext_item', function(req, res, next) {

    var idext_item = req.params.idext_item; 

    var getItem = function(retfunc){
        connection.query('SELECT idint_item, name_item, description_item, value_item, quantity_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results, fields) {
            if(error) res.send(error);
            else retfunc(results);
        });
    }

    getItem(function(results) {
        res.json(results);
    });

});



/* POST new item. */
router.post('/', function(req, res, next) {

    var idext_item = req.body.idext_item;
    var name_item =  req.body.name_item;
    var description_item = req.body.description_item;
    var value_item = req.body.value_item;
    var quantity_item = req.body.quantity_item;

    // Test des valeurs

    var postItem = function(retfunc){
        connection.query('INSERT INTO item_cashReg (idext_item, name_item, description_item, value_item, quantity_item) VALUES (?, ?, ?, ?, ?)', [idext_item, name_item, description_item, value_item, quantity_item], function(error, results, fields) {
            if(error) res.send(error);
            else retfunc(results);
        });
    }

    postItem(function(results) {
        res.json(results);
    });

});



/* PUT item. */
router.put('/:idext_item', function(req, res, next) {

    var idext_item = req.params.idext_item;
    var name_item =  req.body.name_item;
    var description_item = req.body.description_item;
    var value_item = req.body.value_item;
    var quantity_item = req.body.quantity_item;

    var putItem = function(retfunc){
        connection.query('UPDATE item_cashReg SET name_item = ?, description_item = ?, value_item = ?, quantity_item = ? WHERE idext_item = ?', [name_item, description_item, value_item, quantity_item, idext_item], function(error, results, fields) {
            if(error) res.send(error);
            else retfunc(results);
        });
    }

    putItem(function(results) {
        res.json(results);
    });

});



/* DELETE item. */
router.delete('/:idext_item', function(req, res, next) {

    var idext_item = req.params.idext_item;

    var deleteItem = function(retfunc){
        connection.query('DELETE FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results, fields) {
            if(error) res.send(error);
            else retfunc(results);
        });
    }

    deleteItem(function(results) {
        res.json(results);
    });

});

module.exports = router;
