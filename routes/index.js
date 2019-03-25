/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var menus = require('../config/menus');
var url = require('url');
var router = express.Router();
var wifiMaster = "";

router.use(function(req, res, next) {
    urlobj = url.parse(req.url, true);
    if (urlobj.pathname === '/login' || req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
});

// Add router path from menus.js
for (var i = 0; i < menus.length; i++) {
    router.use('/', require('./'+ menus[i].href));
}

//Start page.
router.get('/', function(req, res) {
    //Mod by Tom for merge the version of RIOT_20180730, 2018-08-16.
    res.redirect('/invResults');
    //res.redirect('/configuration');
    //End by Tom for merge the version of RIOT_20180730, 2018-08-16.
});

module.exports = router;
