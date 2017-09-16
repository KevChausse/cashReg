var express = require('express');
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


module.exports = router;
