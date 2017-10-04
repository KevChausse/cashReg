var express = require('express');
var validator = require('validator');
var router = express.Router();

var connection = require('../lib/connection');

// Users management part

/* GET user listing. */
router.get('/', function(req, res, next) {
  
      var getUsersList = function(retfunc){
          connection.query('SELECT idext_user, fname_user, lname_user, email_user, birthdate_user FROM user_cashReg', function(error, results, fields) {
              
              if(error) res.send(error);
              else retfunc(results);
  
          });
      }
  
      getUsersList(function(results) {
          res.json(results);
      });
  
});



/* GET user detail. */
router.get('/:idext_user', function(req, res, next) {
    idext_user = req.params.idext_user

    var getUser = function(retfunc){
        if( !Number.isNaN(idext_user) && idext_user>0 ){
            connection.query('SELECT idext_user, fname_user, lname_user, email_user, birthdate_user FROM user_cashReg WHERE idext_user = ?', [idext_user], function(error, results, fields) {        
                if(error) res.send(error);
                else if(results.length>0){
                    retfunc(results);
                }
                else {
                    var error = {
                        'error_id' : 13,
                        'error_type' : "ERR_ID_NON_EXISTENT",
                        'error_value' : idext_user,
                        'error_var' : "idext_user",
                        'error_text' : "Erreur ERR_ID_NON_EXISTENT - La valeur de idext_user ("+idext_user+") n'existe pas."
                    }
                    retfunc(error)
                }
            });
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_user,
                'error_var' : "idext_user",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_user ("+idext_user+") est incorrect."
            }
            retfunc(error)
        }
    }

    getUser(function(results) {
        res.json(results);
    });

});



/* POST new user. */
router.post('/', function(req, res, next) {

    var idext_user = req.body.idext_user;
    var fname_user =  req.body.fname_user;
    var lname_user = req.body.lname_user;
    var email_user = req.body.email_user;
    var birthdate_user = req.body.birthdate_user;

    var postUser = function(retfunc){
        if( !Number.isNaN(idext_user) && idext_user>0 && validator.isEmail(email_user) && validator.isISO8601(birthdate_user) ){  
          
            connection.query('SELECT idext_user FROM user_cashReg WHERE idext_user = ? OR email_user = ?', [idext_user, email_user], function(error, results_idext, fields) {
                if(results_idext.length <= 0){
                    connection.query('INSERT INTO user_cashReg (idext_user, fname_user, lname_user, email_user, birthdate_user) VALUES (?, ?, ?, ?, ?)', [idext_user, fname_user, lname_user, email_user, birthdate_user], function(error, results, fields) {
                        if(error) res.send(error);
                        else {
                            var success = {
                                'success_id' : 21,
                                'success_type' : 'SUCC_POST_ELT',
                                'success_value' : idext_user,
                                'success_var' : 'idext_user',
                                'success_text' : 'Le nouvel utilisateur ('+idext_user+') a bien été ajouté'
                            }
                            retfunc(success);
                        }
                    });
                }
                else {
                    var error = {
                        'error_id' : 12,
                        'error_type' : "ERR_ID_ALREADY_EXISTS",
                        'error_value' : idext_user,
                        'error_var' : "idext_user",
                        'error_text' : "Erreur ERR_ID_ALREADY_EXISTS - L'objet ayant pour id idext_user ("+idext_user+") est déjà existant."
                    }
                    retfunc(error)
                }
                
            })
        }
        else {
            if(!validator.isEmail(email_user)){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : email_user,
                    'error_var' : "email_user",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de email_user ("+email_user+") est incorrect."
                }
                retfunc(error)
            }
            else if(!validator.isISO8601(birthdate_user)){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : birthdate_user,
                    'error_var' : "birthdate_user",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de birthdate_user ("+birthdate_user+") est incorrect."
                }
                retfunc(error)
            }
            else{
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : idext_user,
                    'error_var' : "idext_user",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_user ("+idext_user+") est incorrect."
                }
                retfunc(error)
            }
        }
    }

    postUser(function(results) {
        res.json(results);
    });

});



/* PUT user. */
router.put('/:idext_user', function(req, res, next) {

    var idext_user = req.params.idext_user;
    var fname_user =  req.body.fname_user;
    var lname_user = req.body.lname_user;
    var email_user = req.body.email_user;
    var birthdate_user = req.body.birthdate_user;

    var putUser = function(retfunc){
        if( !Number.isNaN(idext_user) && idext_user>0 && validator.isEmail(email_user) && validator.isISO8601(birthdate_user) ){  
            
            connection.query('SELECT email_user FROM user_cashReg WHERE email_user = ? AND idext_user != ?', [email_user, idext_user], function(error, results_idext, fields) {
                if(results_idext.length <= 0){
                    connection.query('UPDATE user_cashReg SET fname_user = ?, lname_user = ?, email_user = ?, birthdate_user = ? WHERE idext_user = ?', [fname_user, lname_user, email_user, birthdate_user, idext_user], function(error, results, fields) {
                        if(error) res.send(error);
                        else {
                            var success = {
                                'success_id' : 23,
                                'success_type' : 'SUCC_PUT_ELT',
                                'success_value' : idext_user,
                                'success_var' : 'idext_user',
                                'success_text' : 'L\'utilisateur ('+idext_user+') a bien été modifié'
                            }
                            retfunc(success);
                        }
                    });
                }
                else {
                    var error = {
                        'error_id' : 12,
                        'error_type' : "ERR_ID_ALREADY_EXISTS",
                        'error_value' : idext_user,
                        'error_var' : "idext_user",
                        'error_text' : "Erreur ERR_ID_ALREADY_EXISTS - L'objet ayant pour id idext_user ("+idext_user+") est déjà existant."
                    }
                    retfunc(error)
                }
                
            })
        }
        else {
            if(!validator.isEmail(email_user)){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : email_user,
                    'error_var' : "email_user",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de email_user ("+email_user+") est incorrect."
                }
                retfunc(error)
            }
            else if(!validator.isISO8601(birthdate_user)){
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : birthdate_user,
                    'error_var' : "birthdate_user",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de birthdate_user ("+birthdate_user+") est incorrect."
                }
                retfunc(error)
            }
            else{
                var error = {
                    'error_id' : 11,
                    'error_type' : "ERR_VALUE_FORMAT",
                    'error_value' : idext_user,
                    'error_var' : "idext_user",
                    'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_user ("+idext_user+") est incorrect."
                }
                retfunc(error)
            }
        }
    }

    putUser(function(results) {
        res.json(results);
    });

});



/* DELETE user. */
router.delete('/:idext_user', function(req, res, next) {

    var idext_user = req.params.idext_user;

    var deleteUser = function(retfunc){
        if( idext_user && !Number.isNaN(idext_user) && idext_user>0 ){
            connection.query('DELETE FROM user_cashReg WHERE idext_user = ?', [idext_user], function(error, results, fields) {
                if(error) res.send(error);
                else{
                    var success = {
                        'success_id' : 24,
                        'success_type' : 'SUCC_DEL_ELT',
                        'success_value' : idext_user,
                        'success_var' : 'idext_user',
                        'success_text' : 'L\'utilisateur ('+idext_user+') a bien été supprimé'
                    }
                    retfunc(success);
                }
            });
        }
        else {
            var error = {
                'error_id' : 11,
                'error_type' : "ERR_VALUE_FORMAT",
                'error_value' : idext_user,
                'error_var' : "idext_user",
                'error_text' : "Erreur ERR_VALUE_FORMAT - Le format de la valeur de idext_user ("+idext_user+") est incorrect."
            }
            retfunc(error)
        }
    }

    deleteUser(function(results) {
        res.json(results);
    });

});



module.exports = router;
