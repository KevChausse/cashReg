var express = require('express');
var router = express.Router();

var connection = require('../lib/connection');

// Users management part

/* GET user listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
