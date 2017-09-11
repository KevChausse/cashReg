var express = require('express');
var router = express.Router();

var connection = require('../lib/connection');

// Sum management part

/* GET sum listing. */
router.get('/', function(req, res, next) {

    var getSumsList = function(retfunc){
        connection.query('SELECT idext_sum, COALESCE(SUM(value_item * quantity_sum),0) as total_sum, date_sum FROM sum_cashReg s LEFT JOIN sum_item_cashReg si ON si.id_sum=s.idint_sum LEFT JOIN item_cashReg i ON si.id_item = i.idint_item GROUP BY idint_sum', function(error, results, fields) {
            
            if(error) res.send(error);
            else retfunc(results);

        });
    }

    getSumsList(function(results) {
        res.json(results);
    });

});



/* GET sum detail. */
router.get('/:idext_sum', function(req, res, next) {
    idext_sum = req.params.idext_sum

    var getSumsItem = function(retfunc){
        connection.query('SELECT idext_sum, COALESCE(SUM(value_item * quantity_sum),0) as total_sum, date_sum FROM sum_item_cashReg si JOIN item_cashReg i ON si.id_item = i.idint_item RIGHT JOIN sum_cashReg s ON si.id_sum=s.idint_sum WHERE idext_sum = ? GROUP BY idint_sum', [idext_sum], function(error, results, fields) {
            
            if(error) res.send(error);
            else {
                connection.query('SELECT name_item, quantity_sum, value_item, COALESCE((value_item * quantity_sum),0) as total_item FROM sum_item_cashReg si JOIN sum_cashReg s ON si.id_sum = s.idint_sum JOIN item_cashReg i ON si.id_item = i.idint_item WHERE idext_sum = ? ', [idext_sum], function(error, resultItem, fields) {

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

    getSumsItem(function(results) {
        res.json(results);
    });


});



/* POST new sum. */
router.post('/', function(req, res, next) {
    idext_sum = req.body.idext_sum;

    var postSum = function(retfunc){
        if( !Number.isNaN(idext_sum) ){
            connection.query('INSERT INTO sum_cashReg (idext_sum) VALUES (?)', [idext_sum], function(error, results, fields) {
                
                if(error) res.send(error);
                else retfunc(results);

            });
        }
        else {
            res.send("Erreur de format de valeur.");
        }
    }

    postSum(function(results) {
        res.json(results);
    });

});



/* POST new sum item. */
router.post('/:idext_sum', function(req, res, next) {

});



/* DELETE sum item or sum. */
router.delete('/:idext_sum', function(req, res, next) {

});

module.exports = router;
