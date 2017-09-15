var express = require('express');
var router = express.Router();

var connection = require('../lib/connection');

// Categories management part

/* GET categories listing. */
router.get('/', function(req, res, next) {

    var getCategoriesList = function(retfunc){
        connection.query('SELECT idext_categorie, name_categorie, description_categorie FROM categorie_cashReg', function(error, results, fields) {
            if(error) res.send(error);
            else retfunc(results);
        });
    }

    getCategoriesList(function(results) {
        res.json(results);
    });

});





/* GET sum detail. */
router.get('/:idext_categorie', function(req, res, next) {
    idext_categorie = req.params.idext_categorie

    var getCategoriesItem = function(retfunc){
        connection.query('SELECT idext_categorie, name_categorie, description_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [idext_categorie], function(error, results, fields) {
            
            if(error) res.send(error);
            else {
                connection.query('SELECT idext_item, name_item, value_item FROM categorie_item_cashReg ci JOIN categorie_cashReg c ON ci.id_categorie = c.idint_categorie JOIN item_cashReg i ON ci.id_item = i.idint_item WHERE idext_categorie = ? ', [idext_categorie], function(error, resultItem, fields) {

                    if(error) res.send(error);
                    else {
                        if(resultItem.length>0){
                            results[0]['items'] = resultItem
                        }
                        retfunc(results);
                    }
                    
                });
            }

        });
    }

    getCategoriesItem(function(results) {
        res.json(results);
    });


});


module.exports = router;
