var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var passport = require('passport')
var session = require('express-session')
var MongoStore = require('connect-mongostore')(session);
var config = require('./config/config')();
var auth = require('./routes/auth');
var routes = require('./routes/index');
var poll = require('./routes/poll');
var User = require('./models/user');

var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var app = express();

mongoose.connect(config.dbUrl)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'jagapoga',
    store: new MongoStore({
        db: 'votingapp'
    })
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(user_id, done) {
    User.findById(user_id, function(err, user) {
        done(err, user);
    })
});

passport.use('facebook', new FacebookStrategy({
        clientID: config.facebookAppId,
        clientSecret: config.facebookAppSecret,
        callbackURL: config.facebookCallbackUrl,
        profileFields: ['id', 'displayName', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            console.log(profile)
            User.findOne({
                email: profile.emails[0].value
            }, function(err, user) {
                if (err)
                    return done(err)
                if (user)
                    return done(null, user)
                var user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    facebook: {
                        id: profile.id
                    }
                })
                user.save(function(err, u) {
                    return done(err, u)
                })
            })
        })
    }
))

passport.use('google', new GoogleStrategy({
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackUrl
    },
    function(accessToken, refreshToken, profile, done) {

        process.nextTick(function() {
            console.log(profile)
            User.findOne({
                email: profile.email
            }, function(err, user) {
                if (err)
                    return done(err)
                if (user)
                    return done(null, user)
                var user = new User({
                    name: profile.displayName,
                    email: profile.email,
                    google: {
                        id: profile.id
                    }
                })
                user.save(function(err, u) {
                    return done(err, u)
                })
            })
        })

    }
));

app.use('/', routes);
app.use('/auth', auth);
app.use('/poll', poll);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Node.js listening on port ' + port + '...');
});
