var express = require('express');
var router = express.Router();

var connection = require('../lib/connection');

// Sum management part

/* GET sum listing. */
router.get('/', function(req, res, next) {

    var getSumsList = function(retfunc){
        connection.query('SELECT idext_sum, SUM((value_item * quantity_sum)) as total_item, date_sum FROM sum_item_cashReg si JOIN item_cashReg i ON si.id_item = i.idint_item JOIN sum_cashReg s ON si.id_sum=s.idint_sum GROUP BY idint_sum', function(error, results, fields) {
            
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

// + joindre liste des items + qte
    var getSumsItem = function(retfunc){
        connection.query('SELECT idext_sum, SUM((value_item * quantity_sum)) as total_item, date_sum FROM sum_item_cashReg si JOIN item_cashReg i ON si.id_item = i.idint_item JOIN sum_cashReg s ON si.id_sum=s.idint_sum WHERE idext_sum = ? GROUP BY idint_sum', [idext_sum], function(error, results, fields) {
            
            if(error) res.send(error);
            else /* + joindre liste des items + qte */ retfunc(results);

        });
    }

    getSumsItem(function(results) {
        res.json(results);
    });


});



/* POST new sum. */
router.post('/', function(req, res, next) {

});



/* POST new sum item. */
router.post('/:idext_sum', function(req, res, next) {

});



/* DELETE sum item or sum. */
router.delete('/:idext_sum', function(req, res, next) {

});

module.exports = router;
