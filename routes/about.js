/* MTI CONFIDENTIAL INFORMATION */

var express = require('express');
var menus = require('../config/menus');
var router = express.Router();

router.get('/about', function(req, res) {
    res.render('about.html', {
        target: 'about',
        menus: menus
    });
});

module.exports = router;
