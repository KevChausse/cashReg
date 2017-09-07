var express = require('express');
var router = express.Router();

var connection = require('../lib/connection');


connection.connect();


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

    var postItem = function(retfunc){
        if( !Number.isNaN(idext_item) && idext_item>0 && !Number.isNaN(quantity_item) && quantity_item>=-1 && !Number.isNaN(value_item) && value_item>=0 ){  
            connection.query('INSERT INTO item_cashReg (idext_item, name_item, description_item, value_item, quantity_item) VALUES (?, ?, ?, ?, ?)', [idext_item, name_item, description_item, value_item, quantity_item], function(error, results, fields) {
                if(error) res.send(error);
                else retfunc(results);
            });
        }
        else {
            res.send("Erreur de format de valeur.");
        }
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

        if( !Number.isNaN(idext_item) && idext_item>0 && !Number.isNaN(quantity_item) && quantity_item>=-1 && !Number.isNaN(value_item) && value_item>=0 ){
            connection.query('UPDATE item_cashReg SET name_item = ?, description_item = ?, value_item = ?, quantity_item = ? WHERE idext_item = ?', [name_item, description_item, value_item, quantity_item, idext_item], function(error, results, fields) {
                if(error) res.send(error);
                else retfunc(results);
            });
        }
        else {
            res.send("Erreur de format de valeur.");
        }
    }

    putItem(function(results) {
        res.json(results);
    });

});



/* DELETE item. */
router.delete('/:idext_item', function(req, res, next) {

    var idext_item = req.params.idext_item;

    var deleteItem = function(retfunc){
        if( !Number.isNaN(idext_item) && idext_item>0 ){
            connection.query('DELETE FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results, fields) {
                if(error) res.send(error);
                else retfunc(results);
            });
        }
        else {
            res.send("Erreur de format - L'id doit être un nombre");
        }
    }

    deleteItem(function(results) {
        res.json(results);
    });

});



/* DELETE item list. */
router.delete('/', function(req, res, next) {
    
        var idext_item = req.body.idext_item;
        var idext_tab = "", taberror = "";

        if(idext_item.length>1){
            for(var ind = 1; ind < idext_item.length; ind++){
                if( !Number.isNaN(idext_item[ind]) && idext_item[ind]>0 ){
                    idext_tab += " OR idext_item = "+idext_item[ind];
                }
                else {
                    taberror = "Erreur de format - L'id doit être un nombre1";
                    res.send(taberror);
                }
            }
        }
        console.log(idext_item[0])
    
        var deleteItemList = function(retfunc){
            if( !Number.isNaN(idext_item[0]) && idext_item[0]>0 ){
                connection.query('DELETE FROM item_cashReg WHERE idext_item = '+idext_item[0]+idext_tab, function(error, results, fields) {
                    if(error) res.send(error);
                    else retfunc(results);
                });
            }
            else {
                taberror = "Erreur de format - L'id doit être un nombre2";
                res.send(taberror);
            }
        }
    
        deleteItemList(function(results) {
            res.json(results);
        });
    
    });

module.exports = router;
