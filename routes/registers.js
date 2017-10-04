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
        if(!Number.isNaN(idext_register) && idext_register > 0){
            connection.query('SELECT idext_register, name_register FROM register_cashReg WHERE idext_register = ?', [idext_register], function(error, results, fields) {
                
                if(error) res.send(error);
                else {
                    if(results.length > 0){
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
                    else {
                        var error = {
                            'error_id' : 13,
                            'error_type' : "ERR_ID_NON_EXISTENT",
                            'error_value' : idext_register,
                            'error_var' : "idext_register",
                            'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_register ("+idext_register+") n'existe pas."
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
                'error_value' : idext_register,
                'error_var' : "idext_register",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_register ("+idext_register+") est incorrect."
            }
            retfunc(error)
        }
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
        if( !Number.isNaN(idext_register) && idext_register>0 ){
            connection.query('SELECT idext_register FROM register_cashReg WHERE idext_register = ?', [idext_register], function(error, results_idext, fields) {
                if(results_idext.length <= 0){
                        connection.query('INSERT INTO register_cashReg (idext_register, name_register) VALUES (?, ?)', [idext_register, name_register], function(error, results, fields) {
                            if(error) res.send(error);
                            else {
                                var success = {
                                    'success_id' : 21,
                                    'success_type' : 'SUCC_POST_ELT',
                                    'success_value' : idext_register,
                                    'success_var' : 'idext_register',
                                    'success_text' : 'La nouvelle caisse ('+idext_register+') a bien été ajoutée'
                                }
                                retfunc(success);
                            }
                        });
                }
                else {
                    var error = {
                        'error_id' : 12,
                        'error_type' : "ERR_ID_ALREADY_EXISTS",
                        'error_value' : idext_register,
                        'error_var' : "idext_register",
                        'error_text' : "Erreur ERR_ID_ALREADY_EXISTS - L'objet ayant pour id idext_register ("+idext_register+") est déjà existant."
                    }
                    retfunc(error)
                }
            })
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_register,
                'error_var' : "idext_register",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_register ("+idext_register+") est incorrect."
            }
            retfunc(error)
        }
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
                                            var error = {
                                                'error_id' : 14,
                                                'error_type' : "ERR_ID_ALREADY_ADD",
                                                'error_value' : id_categorie,
                                                'error_var' : "id_categorie",
                                                'error_text' : "Erreur ERR_ID_ALREADY_ADD - L'id id_categorie ("+id_categorie+") a déjà été ajouté à la caisse."
                                            }
                                            retfunc(error) 
                                        }
                                        else {
                                            connection.query('INSERT INTO categorie_register_cashReg (id_categorie, id_register) VALUES (?, ?)', [resultsCat[0]['idint_categorie'], resultsReg[0]['idint_register']], function(error, results, fields) {
                                                if(error) res.send(error);
                                                else {
                                                    var success = {
                                                        'success_id' : 22,
                                                        'success_type' : 'SUCC_POST_SUBELT',
                                                        'success_value' : id_categorie,
                                                        'success_var' : 'id_categorie',
                                                        'success_text' : 'La  catégorie ('+id_categorie+') a bien été ajoutée à la caisse ('+idext_register+')'
                                                    }
                                                    retfunc(success);
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    var error = {
                                        'error_id' : 13,
                                        'error_type' : "ERR_ID_NON_EXISTENT",
                                        'error_value' : id_categorie,
                                        'error_var' : "id_categorie",
                                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de id_categorie ("+id_categorie+") n'existe pas."
                                    }
                                    retfunc(error)
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
                                            var error = {
                                                'error_id' : 14,
                                                'error_type' : "ERR_ID_ALREADY_ADD",
                                                'error_value' : id_user,
                                                'error_var' : "id_user",
                                                'error_text' : "Erreur ERR_ID_ALREADY_ADD - L'id id_user ("+id_user+") a déjà été ajouté à la caisse."
                                            }
                                            retfunc(error)
                                        }
                                        else {
                                            connection.query('INSERT INTO user_register_cashReg (id_user, id_register) VALUES (?, ?)', [resultsUser[0]['idint_user'], resultsReg[0]['idint_register']], function(error, results, fields) {
                                                if(error) res.send(error);
                                                else {
                                                    var success = {
                                                        'success_id' : 22,
                                                        'success_type' : 'SUCC_POST_SUBELT',
                                                        'success_value' : id_user,
                                                        'success_var' : 'id_user',
                                                        'success_text' : 'L\'utilisateur ('+id_user+') a bien été ajouté à la caisse ('+idext_register+')'
                                                    }
                                                    retfunc(success);
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    var error = {
                                        'error_id' : 13,
                                        'error_type' : "ERR_ID_NON_EXISTENT",
                                        'error_value' : id_user,
                                        'error_var' : "id_user",
                                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de id_user ("+id_user+") n'existe pas."
                                    }
                                    retfunc(error)
                                }
                            }
                        })
                    }
                    else {
                        var error = {
                            'error_id' : 13,
                            'error_type' : "ERR_ID_NON_EXISTENT",
                            'error_value' : idext_register,
                            'error_var' : "idext_register",
                            'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_register ("+idext_register+") n'existe pas."
                        }
                        retfunc(error)
                        
                    }
                }
            });
        }
        else {
            if( Number.isNaN(Number(idext_register)) || idext_register<=0){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : idext_register,
                    'error_var' : "idext_register",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_register ("+idext_register+") est incorrect."
                }
                retfunc(error)
            }
            else if(typeof id_user !== "number" || quantity_item<=0){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : id_user,
                    'error_var' : "id_user",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de id_user ("+id_user+") est incorrect."
                }
                retfunc(error)
            }
            else {
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : id_categorie,
                    'error_var' : "id_categorie",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de id_categorie ("+id_categorie+") est incorrect."
                }
                retfunc(error)
            }
        }
    }

    postRegisterDetail(function(results) {
        res.json(results);
    });
});



/* PUT register. */
router.put('/:idext_register', function(req, res, next) {
    idext_register = req.params.idext_register;
    name_register = req.body.name_register;

    var putRegister = function(retfunc){

        if( !Number.isNaN(idext_register) && idext_register>0 ){
            connection.query('SELECT idext_register FROM register_cashReg WHERE idext_register = ?', [idext_register], function(error, results_idext, fields) {
                if(results_idext.length > 0){
                        connection.query('UPDATE register_cashReg SET name_register = ? WHERE idext_register = ?', [name_register, idext_register], function(error, results, fields) {
                            
                            if(error) res.send(error);
                            else {
                                var success = {
                                    'success_id' : 23,
                                    'success_type' : 'SUCC_PUT_ELT',
                                    'success_value' : idext_register,
                                    'success_var' : 'idext_register',
                                    'success_text' : 'La caisse ('+idext_register+') a bien été modifiée'
                                }
                                retfunc(success);
                            }

                        });
                }
                else {
                    var error = {
                        'error_id' : 13,
                        'error_type' : "ERR_ID_NON_EXISTENT",
                        'error_value' : idext_register,
                        'error_var' : "idext_register",
                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_register ("+idext_register+") n'existe pas."
                    }
                    retfunc(error)
                }
            })
        }
        else {
            var error = {
                'error_id' : 13,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_register,
                'error_var' : "idext_register",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_register ("+idext_register+") est incorrect."
            }
            retfunc(error)
        }
    }

    putRegister(function(results) {
        res.json(results);
    });

});


/* DELETE register or register's categorie or user. */ 
router.delete('/:idext_register', function(req, res, next) {
    idext_register = req.params.idext_register;
    id_categorie = req.body.id_categorie;
    id_user = req.body.id_user;


    var deleteRegister = function(retfunc){
        if(!Number.isNaN(idext_register) && idext_register > 0){
            connection.query('SELECT idint_register FROM register_cashReg WHERE idext_register = ? ', [idext_register], function(error, resultsReg, fields) {
                if(error) res.send(error)
                else {
                    if(!Number.isNaN(id_categorie) && id_categorie > 0){
                        connection.query('SELECT idint_categorie FROM categorie_cashReg WHERE idext_categorie = ? ', [id_categorie], function(error, resultsCat, fields) {
                            if(error) res.send(error)
                            else {
                                if(resultsCat.length > 0){
                                    connection.query('DELETE FROM categorie_register_cashReg WHERE id_register = ? AND id_categorie = ?', [resultsReg[0]['idint_register'], resultsCat[0]['idint_categorie']], function(error, results, fields) {
                                        if(error) res.send(error)
                                        else {
                                            var success = {
                                                'success_id' : 25,
                                                'success_type' : 'SUCC_DEL_SUBELT',
                                                'success_value' : id_categorie,
                                                'success_var' : 'id_categorie',
                                                'success_text' : 'La catégorie ('+id_categorie+') a bien été supprimée de la caisse ('+idext_register+')'
                                            }
                                            retfunc(success);
                                        }
                                    })
                                }
                                else {
                                    var error = {
                                        'error_id' : 13,
                                        'error_type' : "ERR_ID_NON_EXISTENT",
                                        'error_value' : id_categorie,
                                        'error_var' : "id_categorie",
                                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de id_categorie ("+id_categorie+") n'existe pas."
                                    }
                                    retfunc(error)
                                }
                            }
                        })
                    }
                    else if(id_user && id_user > 0){
                        connection.query('SELECT idint_user FROM user_cashReg WHERE idext_user = ? ', [id_user], function(error, resultsUser, fields) {
                            if(error) res.send(error)
                            else {
                                if(resultsUser.length > 0){
                                    connection.query('DELETE FROM user_register_cashReg WHERE id_register = ? AND id_user = ?', [resultsReg[0]['idint_register'], resultsUser[0]['idint_user']], function(error, results, fields) {
                                        if(error) res.send(error)
                                        else {
                                            var success = {
                                                'success_id' : 25,
                                                'success_type' : 'SUCC_DEL_SUBELT',
                                                'success_value' : id_user,
                                                'success_var' : 'id_user',
                                                'success_text' : 'L\'utilisateur ('+id_user+') a bien été supprimé de la caisse ('+idext_register+')'
                                            }
                                            retfunc(success);
                                        }
                                    })
                                }
                                else {
                                    var error = {
                                        'error_id' : 13,
                                        'error_type' : "ERR_ID_NON_EXISTENT",
                                        'error_value' : id_user,
                                        'error_var' : "id_user",
                                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de id_user ("+id_user+") n'existe pas."
                                    }
                                    retfunc(error)
                                }
                            }
                        })
                    }
                    else if(Number.isNaN(id_categorie) || Number.isNaN(id_user)){
                        if(Number.isNaN(id_categorie)){
                            var error = {
                                'error_id' : 13,
                                'error_type' : "ERR_VALUE_FORMAT",
                                'error_value' : id_categorie,
                                'error_var' : "id_categorie",
                                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de id_categorie ("+id_categorie+") est incorrect."
                            }
                            retfunc(error)
                        }
                        else {
                            var error = {
                                'error_id' : 13,
                                'error_type' : "ERR_VALUE_FORMAT",
                                'error_value' : id_user,
                                'error_var' : "id_user",
                                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de id_user ("+id_user+") est incorrect."
                            }
                            retfunc(error)
                        }
                    }
                    else {
                        if(resultsReg.length > 0){
                            connection.query('DELETE FROM categorie_register_cashReg WHERE id_register = ?', [resultsReg[0]['idint_register']], function(error, results, fields) {
                                if(error) res.send(error)
                                else {
                                    connection.query('DELETE FROM user_register_cashReg WHERE id_register = ?', [resultsReg[0]['idint_register']], function(error, results, fields) {
                                        if(error) res.send(error)
                                        else {
                                            connection.query('DELETE FROM register_cashReg WHERE idext_register = ?', [resultsReg[0]['idint_register']], function(error, results, fields) {
                                                if(error) res.send(error)
                                                else {
                                                    var success = {
                                                        'success_id' : 24,
                                                        'success_type' : 'SUCC_DEL_ELT',
                                                        'success_value' : idext_register,
                                                        'success_var' : 'idext_register',
                                                        'success_text' : 'La caisse ('+idext_register+') a bien été supprimée'
                                                    }
                                                    retfunc(success);
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        else {
                            var error = {
                                'error_id' : 13,
                                'error_type' : "ERR_ID_NON_EXISTENT",
                                'error_value' : idext_register,
                                'error_var' : "idext_register",
                                'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_register ("+idext_register+") n'existe pas."
                            }
                            retfunc(error)
                        }
                    }
                }
            })
        }
        else {
            var error = {
                'error_id' : 13,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_register,
                'error_var' : "idext_register",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_register ("+idext_register+") est incorrect."
            }
            retfunc(error)
        }
    }

    deleteRegister(function(results) {
        res.json(results);
    });
});

module.exports = router;
