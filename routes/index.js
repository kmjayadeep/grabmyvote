var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user')
var Poll = require('../models/poll')

var isAuthenticated = function(req,res,next){
	if(req.isAuthenticated())
		return next()
	res.redirect('/')
}

router.get('/',function(req, res, next) {
    var data = {
        loggedIn: req.isAuthenticated()
    }

    Poll.find({})
    .populate('creator')
    .exec(function(err,polls){
    	if(err)
    		data.polls = [];
    	else
    		data.polls = polls;
    	res.render('index', data);
    })

});

module.exports = router;
