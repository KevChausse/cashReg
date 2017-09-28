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





/* GET categorie detail. */
router.get('/:idext_categorie', function(req, res, next) {
    idext_categorie = req.params.idext_categorie

    var getCategoriesItem = function(retfunc){
        if(typeof idext_categorie === "number" && idext_categorie > 0){
            connection.query('SELECT idext_categorie, name_categorie, description_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [idext_categorie], function(error, results, fields) {
                
                if(error) res.send(error);
                else {
                    connection.query('SELECT idext_item, name_item, value_item FROM categorie_item_cashReg ci JOIN categorie_cashReg c ON ci.id_categorie = c.idint_categorie JOIN item_cashReg i ON ci.id_item = i.idint_item WHERE idext_categorie = ? ', [idext_categorie], function(error, resultItem, fields) {

                        if(error) res.send(error);
                        else {
                            if(results.length > 0){
                                if(resultItem.length>0){
                                    results[0]['items'] = resultItem
                                }
                                retfunc(results)
                            }
                            else {
                                var error = {
                                    'error_id' : 13,
                                    'error_type' : "ERR_ID_NON_EXISTENT",
                                    'error_value' : idext_categorie,
                                    'error_var' : "idext_categorie",
                                    'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_categorie ("+idext_categorie+") n'existe pas."
                                }
                                retfunc(error)
                            }
                            
                        }
                        
                    });
                }

            });
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_categorie,
                'error_var' : "idext_categorie",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_categorie ("+idext_categorie+") est incorrect."
            }
            retfunc(error)
        }
    }

    getCategoriesItem(function(results) {
        res.json(results);
    });

});



/* POST new categorie. */
router.post('/', function(req, res, next) {
    idext_categorie = req.body.idext_categorie;
    name_categorie = req.body.name_categorie;
    description_categorie = req.body.description_categorie;

    var postCategorie = function(retfunc){

        if( typeof idext_categorie === "number" && idext_categorie>0 ){
            connection.query('SELECT idext_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [idext_categorie], function(error, results_idext, fields) {
                if(results_idext.length <= 0){
                        connection.query('INSERT INTO categorie_cashReg (idext_categorie, name_categorie, description_categorie) VALUES (?, ?, ?)', [idext_categorie, name_categorie, description_categorie], function(error, results, fields) {
                            
                            if(error) res.send(error);
                            else retfunc(results);

                        });
                }
                else {
                    var error = {
                        'error_id' : 12,
                        'error_type' : "ERR_ID_ALREADY_EXISTS",
                        'error_value' : idext_categorie,
                        'error_var' : "idext_categorie",
                        'error_text' : "Erreur ERR_ID_ALREADY_EXISTS - L'objet ayant pour id idext_categorie ("+idext_categorie+") est déjà existant."
                    }
                    retfunc(error)
                }
            })
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_categorie,
                'error_var' : "idext_categorie",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_categorie ("+idext_categorie+") est incorrect."
            }
            retfunc(error)
        }
    }
    postCategorie(function(results) {
        res.json(results);
    });

});



/* POST new categorie item. */
router.post('/:idext_categorie', function(req, res, next) {
    idext_categorie = req.params.idext_categorie;
    idext_item = req.body.idext_item;
  
    var postCategorieItem = function(retfunc){
        if( typeof idext_categorie === "number" && idext_categorie>0 && typeof idext_item === "number" && idext_item>0 ){
            connection.query('SELECT idint_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [idext_categorie], function(error, results_idcat, fields) {      
                if(error) res.send(error);
                else {
                    connection.query('SELECT idint_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_iditem, fields) {
                        if(error) res.send(error)
                        else if(results_idcat.length > 0 && results_iditem.length > 0){
                            connection.query('SELECT * FROM categorie_item_cashReg WHERE id_item = ? AND id_categorie = ?', [results_iditem[0]['idint_item'], results_idcat[0]['idint_categorie']], function(error, results_cat, fields) {
                                if(results_cat.length > 0){
                                    var error = {
                                        'error_id' : 14,
                                        'error_type' : "ERR_ID_ALREADY_ADD",
                                        'error_value' : idext_item,
                                        'error_var' : "idext_item",
                                        'error_text' : "Erreur ERR_ID_ALREADY_ADD - L'id idext_item ("+idext_item+") a déjà été ajouté à la catégorie."
                                    }
                                    retfunc(error) 
                                }
                                else {
                                    connection.query('INSERT INTO categorie_item_cashReg (id_categorie, id_item) VALUES (?, ?)', [results_idcat[0]['idint_categorie'], results_iditem[0]['idint_item']], function(error, results, fields) {
                                        if(error) res.send(error);
                                        else retfunc(results);
                                    });
                                }
                            });
                        }
                        else {
                            if(results_idcat.length <= 0){
                                var error = {
                                    'error_id' : 13,
                                    'error_type' : "ERR_ID_NON_EXISTENT",
                                    'error_value' : idext_categorie,
                                    'error_var' : "idext_categorie",
                                    'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_categorie ("+idext_categorie+") n'existe pas."
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
            if(typeof idext_categorie === "number" && idext_categorie>0){
                var error = {
                    'error_id' : 13,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : idext_item,
                    'error_var' : "idext_item",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_item ("+idext_item+") est incorrect."
                }
                retfunc(error)
            }
            else {
                var error = {
                    'error_id' : 13,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : idext_categorie,
                    'error_var' : "idext_categorie",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_categorie ("+idext_categorie+") est incorrect."
                }
                retfunc(error)
            }
        }
    }

    postCategorieItem(function(results) {
        res.json(results);
    });
});


/* PUT categorie. */
router.put('/:idext_categorie', function(req, res, next) {
    idext_categorie = req.params.idext_categorie;
    name_categorie = req.body.name_categorie;
    description_categorie = req.body.description_categorie;

    var putCategorie = function(retfunc){
        if( typeof idext_categorie === "number" && idext_categorie>0 ){
            connection.query('SELECT idext_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [idext_categorie], function(error, results_idext, fields) {
                if(results_idext.length > 0){
                    connection.query('UPDATE categorie_cashReg SET name_categorie = ?, description_categorie = ? WHERE idext_categorie = ?', [name_categorie, description_categorie, idext_categorie], function(error, results, fields) {
                        
                        if(error) res.send(error);
                        else retfunc(results);

                    });
                }
                else {
                    var error = {
                        'error_id' : 12,
                        'error_type' : "ERR_ID_ALREADY_EXISTS",
                        'error_value' : idext_categorie,
                        'error_var' : "idext_categorie",
                        'error_text' : "Erreur ERR_ID_ALREADY_EXISTS - L'objet ayant pour id idext_categorie ("+idext_categorie+") est déjà existant."
                    }
                    retfunc(error)
                }
            })
        }
        else {
            var error = {
                'error_id' : 13,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_categorie,
                'error_var' : "idext_categorie",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_categorie ("+idext_categorie+") est incorrect."
            }
            retfunc(error)
        }
    }
    putCategorie(function(results) {
        res.json(results);
    });
});



/* DELETE categorie item or categories. */
router.delete('/:idext_categorie', function(req, res, next) {
    idext_categorie = req.params.idext_categorie;
    idext_item = req.body.idext_item;


    var deleteCategorieItem = function(retfunc){
        if(typeof idext_categorie === "number" && idext_categorie>0){
            connection.query('SELECT idint_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [idext_categorie], function(error, results_idcat, fields) {     
                if(error) res.send(error);
                else if(results_idcat.length > 0){
                    if(idext_item && typeof idext_item === "number" && idext_item>0){
                        connection.query('SELECT idint_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_iditem, fields) {     
                            if(error) res.send(error);
                            else if(results_iditem.length > 0){
                                connection.query('DELETE FROM categorie_item_cashReg WHERE id_categorie = ? AND id_item = ?', [results_idcat[0]['idint_categorie'], results_iditem[0]['idint_item']], function(error, results, fields) {
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
                        if(typeof idext_categorie === "number" && idext_categorie>0){
                            var error = {
                                'error_id' : 13,
                                'error_type' : "ERR_VALUE_FORMAT",
                                'error_value' : idext_item,
                                'error_var' : "idext_item",
                                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_item ("+idext_item+") est incorrect."
                            }
                            retfunc(error)
                        }
                        else {
                            connection.query('DELETE FROM categorie_item_cashReg WHERE id_categorie = ? ', [results_idcat[0]['idint_categorie']], function(error, results, fields) {
                                if(error) res.send(error);
                                else connection.query('DELETE FROM categorie_cashReg WHERE idint_categorie = ? ', [results_idcat[0]['idint_categorie']], function(error, results, fields) {
                                    if(error) res.send(error);
                                    else retfunc(results);
                                });
                            });
                        }
                        
                    }
                }
                else {
                    var error = {
                        'error_id' : 13,
                        'error_type' : "ERR_ID_NON_EXISTENT",
                        'error_value' : idext_categorie,
                        'error_var' : "idext_categorie",
                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_categorie ("+idext_categorie+") n'existe pas."
                    }
                    retfunc(error)
                }
            });
        }
        else {
            var error = {
                'error_id' : 13,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_categorie,
                'error_var' : "idext_categorie",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_categorie ("+idext_categorie+") est incorrect."
            }
            retfunc(error)
        }
    }
    deleteCategorieItem(function(results) {
        res.json(results);
    });
});


module.exports = router;
