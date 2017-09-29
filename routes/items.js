var express = require('express');
var router = express.Router();

var connection = require('../lib/connection');

// Items management part

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
        if(!Number.isNaN(idext_item) && idext_item > 0){
            connection.query('SELECT idint_item, name_item, description_item, value_item, quantity_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results, fields) {
                if(error) res.send(error);
                else if(results.length > 0){
                    retfunc(results);
                }
                else {
                    var error = {
                        'error_id' : 13,
                        'error_type' : "ERR_ID_NON_EXISTENT",
                        'error_value' : idext_item,
                        'error_var' : "idext_item",
                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_item ("+idext_item+") n'existe pas."
                    }
                    retfunc(error)
                }
            });
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_item,
                'error_var' : "idext_item",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_item ("+idext_item+") est incorrect."
            }
            retfunc(error)
        }
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
        if( typeof idext_item === "number" && idext_item>0 && typeof quantity_item === "number" && quantity_item>=-1 && typeof value_item === "number" && value_item>=0 ){  
            
            connection.query('SELECT idext_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_idext, fields) {
                if(results_idext.length <= 0){
                    connection.query('INSERT INTO item_cashReg (idext_item, name_item, description_item, value_item, quantity_item) VALUES (?, ?, ?, ?, ?)', [idext_item, name_item, description_item, value_item, quantity_item], function(error, results, fields) {
                        if(error) res.send(error);
                        else retfunc(results);
                    });
                }
                else {
                    var error = {
                        'error_id' : 12,
                        'error_type' : "ERR_ID_ALREADY_EXISTS",
                        'error_value' : idext_item,
                        'error_var' : "idext_item",
                        'error_text' : "Erreur ERR_ID_ALREADY_EXISTS - L'objet ayant pour id idext_item ("+idext_item+") est déjà existant."
                    }
                    retfunc(error)
                }
            })
        }
        else {
            if(typeof idext_item !== "number" || idext_item<=0){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : idext_item,
                    'error_var' : "idext_item",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_item ("+idext_item+") est incorrect."
                }
                retfunc(error)
            }
            else if(typeof quantity_item !== "number" || quantity_item<-1){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : quantity_item,
                    'error_var' : "quantity_item",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de quantity_item ("+quantity_item+") est incorrect."
                }
                retfunc(error)
            }
            else if(typeof value_item !== "number" || value_item<0){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : value_item,
                    'error_var' : "value_item",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de value_item ("+value_item+") est incorrect."
                }
                retfunc(error)
            }
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
        if( idext_item && name_item && description_item && value_item && quantity_item && !Number.isNaN(idext_item) && idext_item>0 && typeof quantity_item === "number" && quantity_item>=-1 && typeof value_item === "number" && value_item>=0 ){
            connection.query('SELECT idext_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_idext, fields) {
                if(results_idext.length > 0){
                    connection.query('UPDATE item_cashReg SET name_item = ?, description_item = ?, value_item = ?, quantity_item = ? WHERE idext_item = ?', [name_item, description_item, value_item, quantity_item, idext_item], function(error, results, fields) {
                        if(error) res.send(error);
                        else retfunc(results);
                    });
                }
                else {
                    var error = {
                        'error_id' : 13,
                        'error_type' : "ERR_ID_NON_EXISTENT",
                        'error_value' : idext_item,
                        'error_var' : "idext_item",
                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_item ("+idext_item+") n'existe pas."
                    }
                    retfunc(error)
                }
            });
        }
        else {
            if( Number.isNaN(Number(idext_item)) || idext_item<=0){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : idext_item,
                    'error_var' : "idext_item",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_item ("+idext_item+") est incorrect."
                }
                retfunc(error)
            }
            else if(typeof quantity_item !== "number" || quantity_item<-1){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : quantity_item,
                    'error_var' : "quantity_item",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de quantity_item ("+quantity_item+") est incorrect."
                }
                retfunc(error)
            }
            else if(typeof value_item !== "number" || value_item<0){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : value_item,
                    'error_var' : "value_item",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de value_item ("+value_item+") est incorrect."
                }
                retfunc(error)
            }
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
        if( idext_item && !Number.isNaN(idext_item) && idext_item>0 ){
            connection.query('SELECT idext_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_idext, fields) {
                if(results_idext.length > 0){
                    connection.query('DELETE FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results, fields) {
                        if(error) res.send(error);
                        else retfunc(results);
                    });
                }
                else {
                    var error = {
                        'error_id' : 13,
                        'error_type' : "ERR_ID_NON_EXISTENT",
                        'error_value' : idext_item,
                        'error_var' : "idext_item",
                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_item ("+idext_item+") n'existe pas."
                    }
                    retfunc(error)
                }
            });
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_item,
                'error_var' : "idext_item",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_item ("+idext_item+") est incorrect."
            }
            retfunc(error)
        }
    }

    deleteItem(function(results) {
        res.json(results);
    });

});

module.exports = router;
