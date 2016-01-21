var express = require('express');
var router = express.Router();
var Poll = require('../models/poll')
GLOBAL._ = require('underscore')

var reqAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next()
    res.redirect('/')
}

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next()
    return res.redirect('/')
}

router.get('/view/:id', function(req, res) {
    var id = req.params.id
    data = {
        loggedIn: req.isAuthenticated(),
        user: req.user
    }
    var colors = ["#F7464A", "#46BFBD", "#FDB45C"]
    var highlights = ["#FF5A5E", "#5AD3D1", "#FFC870"]
    Poll.findById(id)
        .populate('creator')
        .exec(function(err, poll) {
            data.poll = poll
            var options = poll.options
            var color = 0
            data.chartData = options.map(function(option) {
                return {
                    value: option.noVotes,
                    label: option.option,
                    color: colors[color % colors.length],
                    highlight: highlights[color++ % colors.length]
                }
            })
            if (data.loggedIn && poll.vote.indexOf(req.user._id) == -1)
                data.optionClass = "poll-option"
            else
                data.optionClass = ""
            if (req.user._id + '' == poll.creator._id + '')
                data.owner = true
            else
                data.owner = false
            res.render('poll', data)
        })
})

router.get('/vote/:id/:option', isAuthenticated, function(req, res) {
    var id = req.params.id
    var option = req.params.option

    Poll.findById(id, function(err, poll) {
        if (err)
            return res.render('error', {
                message: 'Invalid id',
                error: {}
            })
        var selectedOption = poll.options.id(option)
        if (!selectedOption)
            return res.render('error', {
                message: 'Invalid id',
                error: {}
            })
        if (poll.vote.indexOf(req.user._id) == -1) {
            selectedOption.noVotes++;
            poll.vote.push(req.user._id)
            poll.save(function(err) {
                if (err)
                    return res.render('error', {
                        message: 'Invalid id',
                        error: {}
                    })
                res.redirect('/poll/view/' + id)

            })
        } else
            res.redirect('/poll/view/' + id)

    })

})

router.get('/delete/:id', isAuthenticated, function(req, res) {
    var id = req.params.id
    Poll.findById(id, function(err, poll) {
        if (err)
            return res.redirect('/')

        if (poll.creator + '' == req.user._id) {
            poll.remove(function() {
                return res.redirect('/')
            })
        } else {
            return res.redirect('/')
        }
    })
})

router.post('/option', isAuthenticated, function(req, res) {
    var id = req.body._id
    var option = req.body.option

    Poll.findById(id, function(err, poll) {
        if (err)
            return res.send('err')
        if (poll.creator + '' != req.user._id + '')
            return res.send('not auth')
        poll.options.push({
            noVotes: 0,
            option: option
        })
        poll.save(function(err) {
            if (err)
                return res.send('err')
            return res.send('ok')
        })

    })




})


router.post('/new', isAuthenticated, function(req, res, next) {
    var ch = JSON.parse(req.body.choices);
    var choices = ch.map(function(v) {
        return {
            option: v
        }
    })
    var poll = new Poll({
        question: req.body.question,
        options: choices,
        creator: req.user._id
    })
    poll.save(function(err, p) {
        if (err)
            return res.json({
                code: 1,
                message: 'Save failed'
            })
        return res.json({
            code: 0,
            message: 'Save successfull'
        })
    })
});

module.exports = router;
