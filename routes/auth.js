var express = require('express');
var router = express.Router();
var user = require('../models/user')
var passport = require('passport')

router.get('/', function(req, res, next) {
    res.send('Invalid URL')
});

router.get('/facebook',
    passport.authenticate('facebook', {
        scope: 'email'
    }),
    function(req, res) {})

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/'
    }),
    function(req, res) {
        res.redirect('/')
    }
)

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
})

module.exports = router;
