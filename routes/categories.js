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



/* POST new categorie. */
router.post('/', function(req, res, next) {
    idext_categorie = req.body.idext_categorie;
    name_categorie = req.body.name_categorie;
    description_categorie = req.body.description_categorie;

    var postCategorie = function(retfunc){
        connection.query('SELECT idext_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [idext_categorie], function(error, results_idext, fields) {
            if(results_idext.length <= 0){
                if( !Number.isNaN(idext_categorie) && idext_categorie>0 ){
                    connection.query('INSERT INTO categorie_cashReg (idext_categorie, name_categorie, description_categorie) VALUES (?, ?, ?)', [idext_categorie, name_categorie, description_categorie], function(error, results, fields) {
                        
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

    postCategorie(function(results) {
        res.json(results);
    });

});



/* POST new categorie item. */
router.post('/:idext_categorie', function(req, res, next) {
    idext_categorie = req.params.idext_categorie;
    idext_item = req.body.idext_item;
  
    var postCategorieItem = function(retfunc){
        if( !Number.isNaN(idext_categorie) && idext_categorie>0 && !Number.isNaN(idext_item) && idext_item>0 ){
            connection.query('SELECT idint_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [idext_categorie], function(error, results_idcat, fields) {      
                if(error) res.send(error);
                else {
                    connection.query('SELECT idint_item FROM item_cashReg WHERE idext_item = ?', [idext_item], function(error, results_iditem, fields) {
                        if(error) res.send(error)
                        else if(results_idcat.length > 0 && results_iditem.length > 0){
                            connection.query('SELECT * FROM categorie_item_cashReg WHERE id_item = ? AND id_categorie = ?', [results_iditem[0]['idint_item'], results_idcat[0]['idint_categorie']], function(error, results_cat, fields) {
                                if(results_cat.length > 0){
                                    res.send("L'item a deja été ajouté à la catégorie");
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
        else {
            res.send("Le format d'une valeur est invalide");
        }
    }

    postCategorieItem(function(results) {
        res.json(results);
    });
});


module.exports = router;
