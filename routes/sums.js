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
        if(!Number.isNaN(idext_sum) && idext_sum > 0){
            connection.query('SELECT idext_sum, COALESCE(SUM(value_item * quantity_sum),0) as total_sum, date_sum FROM sum_item_cashReg si JOIN item_cashReg i ON si.id_item = i.idint_item RIGHT JOIN sum_cashReg s ON si.id_sum=s.idint_sum WHERE idext_sum = ? GROUP BY idint_sum', [idext_sum], function(error, results, fields) {
                
                if(error) res.send(error);
                else {
                    if(results.length>0){
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
                    else {                        
                        var error = {
                            'error_id' : 13,
                            'error_type' : "ERR_ID_NON_EXISTENT",
                            'error_value' : idext_sum,
                            'error_var' : "idext_sum",
                            'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_sum ("+idext_sum+") n'existe pas."
                        }
                        retfunc(error)
                    }
                }

            });
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_sum,
                'error_var' : "idext_sum",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_sum ("+idext_sum+") est incorrect."
            }
            retfunc(error)
        }
    }

    getSumsItem(function(results) {
        res.json(results);
    });

});



/* POST new sum. */
router.post('/', function(req, res, next) {
    idext_sum = req.body.idext_sum;

    var postSum = function(retfunc){
        if( !Number.isNaN(idext_sum) && idext_sum>0 ){
            connection.query('SELECT idext_sum FROM sum_cashReg WHERE idext_sum = ?', [idext_sum], function(error, results_idext, fields) {
                if(results_idext.length <= 0){                    
                        connection.query('INSERT INTO sum_cashReg (idext_sum) VALUES (?)', [idext_sum], function(error, results, fields) {
                            if(error) res.send(error);
                            else {
                                var success = {
                                    'success_id' : 21,
                                    'success_type' : 'SUCC_POST_ELT',
                                    'success_value' : idext_sum,
                                    'success_var' : 'idext_sum',
                                    'success_text' : 'La nouvelle addition ('+idext_sum+') a bien été ajoutée'
                                }
                                retfunc(success);
                            }
                        });
                }
                else {
                    var error = {
                        'error_id' : 12,
                        'error_type' : "ERR_ID_ALREADY_EXISTS",
                        'error_value' : idext_sum,
                        'error_var' : "idext_sum",
                        'error_text' : "Erreur ERR_ID_ALREADY_EXISTS - L'objet ayant pour id idext_sum ("+idext_sum+") est déjà existant."
                    }
                    retfunc(error)
                }
            })
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_sum,
                'error_var' : "idext_sum",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_sum ("+idext_sum+") est incorrect."
            }
            retfunc(error)
        }
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
        if( !Number.isNaN(idext_sum) && idext_sum>0 && typeof idext_item === "number" && idext_item>0 && typeof qty_item === "number" && qty_item>0 ){
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
                                        else {
                                            var success = {
                                                'success_id' : 22,
                                                'success_type' : 'SUCC_POST_SUBELT',
                                                'success_value' : idext_item,
                                                'success_var' : 'idext_item',
                                                'success_text' : 'Les '+qty_item+' items ('+idext_item+') ont bien été ajoutés à l\'addition ('+idext_sum+')'
                                            }
                                            retfunc(success);
                                        }
                                    });
                                }
                                else {
                                    connection.query('INSERT INTO sum_item_cashReg (id_sum, id_item, quantity_sum) VALUES (?, ?, ?)', [results_idsum[0]['idint_sum'], results_iditem[0]['idint_item'], qty_item], function(error, results, fields) {
                                        if(error) res.send(error);
                                        else {
                                            var success = {
                                                'success_id' : 22,
                                                'success_type' : 'SUCC_POST_SUBELT',
                                                'success_value' : idext_item,
                                                'success_var' : 'idext_item',
                                                'success_text' : 'Les '+qty_item+' items ('+idext_item+') ont bien été ajoutés à l\'addition ('+idext_sum+')'
                                            }
                                            retfunc(success);
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            if(results_idsum.length <= 0){
                                var error = {
                                    'error_id' : 13,
                                    'error_type' : "ERR_ID_NON_EXISTENT",
                                    'error_value' : idext_sum,
                                    'error_var' : "idext_sum",
                                    'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_sum ("+idext_sum+") n'existe pas."
                                }
                                retfunc(error)
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
                        }
                    });
                }
            });
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
            else if(typeof qty_item !== "number" || qty_item<=0){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : qty_item,
                    'error_var' : "qty_item",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de qty_item ("+qty_item+") est incorrect."
                }
                retfunc(error)
            }
            else {
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : idext_sum,
                    'error_var' : "idext_sum",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_sum ("+idext_sum+") est incorrect."
                }
                retfunc(error)
            }
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
        if(!Number.isNaN(idext_sum) && idext_sum > 0){
            connection.query('SELECT idint_sum FROM sum_cashReg WHERE idext_sum = ?', [idext_sum], function(error, results_idsum, fields) {     
                if(error) res.send(error);
                else if(results_idsum.length > 0){
                    if(idext_item){
                        if(typeof idext_item === "number" && idext_item){
                            connection.query('SELECT idint_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_iditem, fields) {     
                                if(error) res.send(error);
                                else if(results_iditem.length > 0){
                                    connection.query('SELECT quantity_sum FROM sum_item_cashReg WHERE id_item = ? AND id_sum = ?', [results_iditem[0]['idint_item'], results_idsum[0]['idint_sum']], function(error, results_qty, fields) {     
                                        if(error) res.send(error);
                                        else if(results_qty.length > 0){
                                            if(results_qty[0]['quantity_sum'] == 1){
                                                connection.query('DELETE FROM sum_item_cashReg WHERE id_sum = ? AND id_item = ?', [results_idsum[0]['idint_sum'], results_iditem[0]['idint_item']], function(error, results, fields) {
                                                    if(error) res.send(error);
                                                    else {
                                                        var success = {
                                                            'success_id' : 25,
                                                            'success_type' : 'SUCC_DEL_SUBELT',
                                                            'success_value' : idext_item,
                                                            'success_var' : 'idext_item',
                                                            'success_text' : 'L\'item ('+idext_item+') a bien été retiré de l\'addition ('+idext_sum+')'
                                                        }
                                                        retfunc(success);
                                                    }
                                                });
                                            }
                                            else{
                                                connection.query('UPDATE sum_item_cashReg SET quantity_sum = quantity_sum - 1 WHERE id_item = ? AND id_sum = ?', [results_iditem[0]['idint_item'], results_idsum[0]['idint_sum']], function(error, results, fields) {
                                                    if(error) res.send(error);
                                                    else {
                                                        var success = {
                                                            'success_id' : 25,
                                                            'success_type' : 'SUCC_DEL_SUBELT',
                                                            'success_value' : idext_item,
                                                            'success_var' : 'idext_item',
                                                            'success_text' : 'L\'item ('+idext_item+') (qté: -1) a bien été supprimé de l\'addition ('+idext_sum+')'
                                                        }
                                                        retfunc(success);
                                                    }
                                                });
                                            }
                                        }
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
                    else {
                        connection.query('DELETE FROM sum_item_cashReg WHERE id_sum = ? ', [results_idsum[0]['idint_sum']], function(error, results, fields) {
                            if(error) res.send(error);
                            else connection.query('DELETE FROM sum_cashReg WHERE idint_sum = ? ', [results_idsum[0]['idint_sum']], function(error, results, fields) {
                                if(error) res.send(error);
                                else {
                                    var success = {
                                        'success_id' : 24,
                                        'success_type' : 'SUCC_DEL_ELT',
                                        'success_value' : idext_sum,
                                        'success_var' : 'idext_sum',
                                        'success_text' : 'L\'addition ('+idext_sum_+') a bien été supprimée'
                                    }
                                    retfunc(success);
                                }
                            });
                        });
                    }
                }
                else {
                    var error = {
                        'error_id' : 13,
                        'error_type' : "ERR_ID_NON_EXISTENT",
                        'error_value' : idext_sum,
                        'error_var' : "idext_sum",
                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_sum ("+idext_sum+") n'existe pas."
                    }
                    retfunc(error)
                }
            });
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_sum,
                'error_var' : "idext_sum",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_sum ("+idext_sum+") est incorrect."
            }
            retfunc(error)
        }
    }

    deleteSumItem(function(results) {
        res.json(results);
    });
});

module.exports = router;
