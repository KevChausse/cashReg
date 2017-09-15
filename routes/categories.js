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


module.exports = router;
