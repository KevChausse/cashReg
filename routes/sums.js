var express = require('express');
var router = express.Router();

var connection = require('../lib/connection');

// Sum management part

connection.connect();

/* GET sum listing. */
router.get('/', function(req, res, next) {

});



/* GET sum detail. */
router.get('/:idext_sum', function(req, res, next) {

});



/* POST new sum. */
router.post('/', function(req, res, next) {

});



/* POST new sum item. */
router.post('/:idext_sum', function(req, res, next) {

});



/* DELETE item. */
router.delete('/:idext_sum', function(req, res, next) {

});

module.exports = router;
