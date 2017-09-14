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
        connection.query('SELECT idext_sum FROM sum_cashReg WHERE idext_sum = ?', [idext_sum], function(error, results_idext, fields) {
            if(results_idext.length <= 0){
                if( !Number.isNaN(idext_sum) && idext_sum>0 ){
                    connection.query('INSERT INTO sum_cashReg (idext_sum) VALUES (?)', [idext_sum], function(error, results, fields) {
                        
                        if(error) res.send(error);
                        else retfunc(results);

                    });
                }
                else {
                    res.send("Erreur de format de valeur.");
                }
            }
            else {
                res.send("Erreur - L'id renseigné existe déja.");
            }
        })
    }

    postSum(function(results) {
        res.json(results);
    });

});



/* POST new sum item. */
router.post('/:idext_sum', function(req, res, next) {
    idext_sum = req.params.idext_sum;
    idext_item = req.body.idext_item;
    qty_item = req.body.qty_item;
    
    var postSumItem = function(retfunc){
        if( !Number.isNaN(idext_sum) && idext_sum>0 && !Number.isNaN(idext_item) && idext_item>0 && !Number.isNaN(qty_item) && qty_item>0 ){
            connection.query('SELECT idint_sum FROM sum_cashReg WHERE idext_sum = ?', [idext_sum], function(error, results_idsum, fields) {
                
                if(error) res.send(error);
                else {
                    connection.query('SELECT idint_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_iditem, fields) {
                        if(error) res.send(error)
                        else if(results_idsum.length > 0 && results_iditem.length > 0){
                            connection.query('SELECT quantity_sum FROM sum_item_cashReg WHERE id_item = ? AND id_sum = ?', [results_iditem[0]['idint_item'], results_idsum[0]['idint_sum']], function(error, results_sum, fields) {
                                if(results_sum.length > 0){
                                    connection.query('UPDATE sum_item_cashReg SET quantity_sum = quantity_sum + ? WHERE id_item = ? AND id_sum = ?', [qty_item, results_iditem[0]['idint_item'], results_idsum[0]['idint_sum']], function(error, results, fields) {
                                        if(error) res.send(error);
                                        else retfunc(results);
                                    });
                                }
                                else {
                                    connection.query('INSERT INTO sum_item_cashReg (id_sum, id_item, quantity_sum) VALUES (?, ?, ?)', [results_idsum[0]['idint_sum'], results_iditem[0]['idint_item'], qty_item], function(error, results, fields) {
                                        if(error) res.send(error);
                                        else retfunc(results);
                                    });
                                }
                            });
                        }
                        else {
                            if(results_idsum.length <= 0){
                                res.send("L'id d'addition renseigné est invalide");
                            }
                            else {
                                res.send("L'id d'item renseigné est invalide");
                            }
                        }
                    });
                }
            });
        }
    }

    postSumItem(function(results) {
        res.json(results);
    });
});



/* DELETE sum item or sum. */
router.delete('/:idext_sum', function(req, res, next) {
    idext_sum = req.params.idext_sum;
    idext_item = req.body.idext_item;


    var deleteSumItem = function(retfunc){
        connection.query('SELECT idint_sum FROM sum_cashReg WHERE idext_sum = ?', [idext_sum], function(error, results_idsum, fields) {     
            if(error) res.send(error);
            else if(results_idsum.length > 0){
                if(idext_item){
                    connection.query('SELECT idint_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_iditem, fields) {     
                        if(error) res.send(error);
                        else if(results_iditem.length > 0){
                            connection.query('SELECT quantity_sum FROM sum_item_cashReg WHERE id_item = ? AND id_sum = ?', [results_iditem[0]['idint_item'], results_idsum[0]['idint_sum']], function(error, results_qty, fields) {     
                                if(error) res.send(error);
                                else if(results_qty.length > 0){
                                    if(results_qty[0]['quantity_sum'] == 1){
                                        connection.query('DELETE FROM sum_item_cashReg WHERE id_sum = ? AND id_item = ?', [results_idsum[0]['idint_sum'], results_iditem[0]['idint_item']], function(error, results, fields) {
                                            if(error) res.send(error);
                                            else retfunc(results);
                                        });
                                    }
                                    else{
                                        connection.query('UPDATE sum_item_cashReg SET quantity_sum = quantity_sum - 1 WHERE id_item = ? AND id_sum = ?', [results_iditem[0]['idint_item'], results_idsum[0]['idint_sum']], function(error, results, fields) {
                                            if(error) res.send(error);
                                            else retfunc(results);
                                        });
                                    }
                                }
                                else {
                                    res.send("Erreur - Id item innexistant");
                                }
                            });
                        }
                        else res.send("Erreur - Id innexistant");
                    });
                }
                else {
                        connection.query('DELETE FROM sum_item_cashReg WHERE id_sum = ? ', [results_idsum[0]['idint_sum']], function(error, results, fields) {
                            if(error) res.send(error);
                            else connection.query('DELETE FROM sum_cashReg WHERE idint_sum = ? ', [results_idsum[0]['idint_sum']], function(error, results, fields) {
                                if(error) res.send(error);
                                else retfunc(results);
                            });
                        });
                }
            }
            else res.send("Erreur - Id sum innexistant");
        });
    }

    deleteSumItem(function(results) {
        res.json(results);
    });
});

module.exports = router;
