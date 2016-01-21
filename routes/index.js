var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user')
var Poll = require('../models/poll')

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next()
    res.redirect('/')
}

router.get('/', function(req, res, next) {
    var data = {
        loggedIn: req.isAuthenticated(),
        user: req.user
    }

    Poll.find({})
        .populate('creator')
        .exec(function(err, polls) {
            if (err)
                data.polls = [];
            else
                data.polls = polls;
            res.render('index', data);
        })

});

router.get('/profile', isAuthenticated, function(req, res) {
    var data = {
        loggedIn: true,
        user: req.user
    }
    Poll.find({
        creator: data.user._id
    }, function(err, polls) {
        if (err)
            data.pols = []
        else
            data.polls = polls
        res.render('profile', data)
    })
})

module.exports = router;
