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
        connection.query('SELECT idext_user, fname_user, lname_user, email_user, birthdate_user FROM user_cashReg WHERE idext_user = ?', [idext_user], function(error, results, fields) {        
            if(error) res.send(error);
            else {
                retfunc(results);
            }
        });
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
                        else retfunc(results);
                    });
                }
                else {
                    res.send("Erreur - L'id ou email renseigné existe déja.");
                }
                
            })
        }
        else {
            res.send("Erreur de format de valeur.");
        }
    }

    postUser(function(results) {
        res.json(results);
    });

});


module.exports = router;
