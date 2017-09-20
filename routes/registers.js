var express = require('express');
var router = express.Router();

var connection = require('../lib/connection');

// Registers management part

/* GET register listing. */
router.get('/', function(req, res, next) {

    var getRegistersList = function(retfunc){
        connection.query('SELECT idext_register, name_register FROM register_cashReg', function(error, results, fields) {
            
            if(error) res.send(error);
            else retfunc(results);

        });
    }

    getRegistersList(function(results) {
        res.json(results);
    });

});



/* GET register detail. */ 
router.get('/:idext_register', function(req, res, next) {
    idext_register = req.params.idext_register

    var getRegisterDetail = function(retfunc){
        connection.query('SELECT idext_register, name_register FROM register_cashReg WHERE idext_register = ?', [idext_register], function(error, results, fields) {
            
            if(error) res.send(error);
            else {
                connection.query('SELECT name_categorie FROM categorie_register_cashReg cr JOIN register_cashReg r ON cr.id_register = r.idint_register JOIN categorie_cashReg c ON cr.id_categorie = c.idint_categorie WHERE idext_register = ?', [idext_register], function(error, resultCateg, fields) {

                    if(error) res.send(error);
                    else {
                        connection.query('SELECT fname_user, lname_user FROM user_register_cashReg ur JOIN register_cashReg r ON ur.id_register = r.idint_register JOIN user_cashReg u ON ur.id_user = u.idint_user WHERE idext_register = ?', [idext_register], function(error, resultUser, fields) {
                            if(error) res.send(error);
                            else {
                                if(resultCateg.length>0){
                                    results[0]['categories'] = resultCateg
                                }
                                if(resultUser.length>0){
                                    results[0]['users'] = resultUser
                                }
                                retfunc(results);
                            }
                        });
                    }
                    
                });
            }

        });
    }

    getRegisterDetail(function(results) {
        res.json(results);
    });

});



/* POST new register. */ 
router.post('/', function(req, res, next) {
    idext_register = req.body.idext_register;
    name_register = req.body.name_register;

    var postRegister = function(retfunc){
        connection.query('SELECT idext_register FROM register_cashReg WHERE idext_register = ?', [idext_register], function(error, results_idext, fields) {
            if(results_idext.length <= 0){
                if( !Number.isNaN(idext_register) && idext_register>0 ){
                    connection.query('INSERT INTO register_cashReg (idext_register, name_register) VALUES (?, ?)', [idext_register, name_register], function(error, results, fields) {
                        
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

    postRegister(function(results) {
        res.json(results);
    });

});



/* POST new sum item. */ 
router.post('/:idext_register', function(req, res, next) {
    idext_register = req.params.idext_register;
    id_categorie = req.body.id_categorie;
    id_user = req.body.id_user;
    
    var postRegisterDetail = function(retfunc){
        if( !Number.isNaN(idext_register) && idext_register>0 && ((!Number.isNaN(id_categorie) && id_categorie>0) || (!Number.isNaN(id_user) && id_user>0)) ){
            connection.query('SELECT idint_register FROM register_cashReg WHERE idext_register = ?', [idext_register], function(error, resultsReg, fields) {
                
                if(error) res.send(error);
                else {
                    if(id_categorie && resultsReg.length > 0){
                        connection.query('SELECT idint_categorie FROM categorie_cashReg WHERE idext_categorie = ?', [id_categorie], function(error, resultsCat, fields) {
                            if(error) res.send(error)
                            else {
                                if(resultsCat.length > 0){
                                    connection.query('SELECT id_categorie FROM categorie_register_cashReg WHERE id_categorie = ? AND id_register = ?', [resultsCat[0]['idint_categorie'], resultsReg[0]['idint_register']], function(error, resultsId, fields) {  
                                        if(error) res.send(error);
                                        else if(resultsId.length > 0){
                                            res.send("La categorie a déja été ajoutée");
                                        }
                                        else {
                                            connection.query('INSERT INTO categorie_register_cashReg (id_categorie, id_register) VALUES (?, ?)', [resultsCat[0]['idint_categorie'], resultsReg[0]['idint_register']], function(error, results, fields) {
                                                if(error) res.send(error);
                                                else retfunc(results);
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.send("La categorie n'existe pas");
                                }
                            }
                        })
                    }
                    else if(id_user && resultsReg.length > 0){
                        connection.query('SELECT idint_user FROM user_cashReg WHERE idext_user = ?', [id_user], function(error, resultsUser, fields) {
                            if(error) res.send(error)
                            else {
                                if(resultsUser.length > 0){
                                    connection.query('SELECT id_user FROM user_register_cashReg WHERE id_user = ? AND id_register = ?', [resultsUser[0]['idint_user'], resultsReg[0]['idint_register']], function(error, resultsId, fields) {  
                                        if(error) res.send(error);
                                        else if(resultsId.length > 0){
                                            res.send("L'utilisateur a déja été ajoutée");
                                        }
                                        else {
                                            connection.query('INSERT INTO user_register_cashReg (id_user, id_register) VALUES (?, ?)', [resultsUser[0]['idint_user'], resultsReg[0]['idint_register']], function(error, results, fields) {
                                                if(error) res.send(error);
                                                else retfunc(results);
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.send("L'utilisateur n'existe pas");
                                }
                            }
                        })
                    }
                    else {
                        if(resultsReg.length > 0){
                            res.send("L'id de caisse renseigné est invalide");
                        }
                        else if(id_categorie){
                            res.send("L'id de categorie renseigné est invalide");
                        }
                        else{
                            res.send("L'id de utilisateur renseigné est invalide");
                        }
                        
                    }
                }
            });
        }
        else {
            res.send("Le format d'une valeur est invalide");
        }
    }

    postRegisterDetail(function(results) {
        res.json(results);
    });
});



/* DELETE sum item or sum. */ /*
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
*/
module.exports = router;
