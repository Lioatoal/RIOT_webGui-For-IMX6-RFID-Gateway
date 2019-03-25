/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('login.html');
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }, function(err, user, info) {
        if (err) {
            return res.render('login.html', {
                title: 'Sign In',
                errorMessage: err.message
            });
        }

        if (!user) {
            return res.render('login.html', {
                title: 'Sign In',
                errorMessage: info.message
            });
        }
        return req.logIn(user, function(err) {
            if (err) {
                return res.render('login.html', {
                    title: 'Sign In',
                    errorMessage: err.message
                });
            } else {
                return res.redirect('/');
            }
        });
    })(req, res, next);
});

router.get('/logout', function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        req.logout();
        res.redirect('/login');
    }
});

router.get('/useragent', function(req, res){
    res.send(req.useragent);
});


module.exports = router;
