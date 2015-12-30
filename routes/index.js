var express = require('express');
var router = express.Router();
var user = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {}
  res.render('index',data);
});

module.exports = router;
