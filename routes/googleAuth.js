var express = require('express');
var router = express.Router();
var googleAuth = require('../local_modules/googleAuth.js');

/* GET redirectUrl listing. */
router.get('/generateAuthUrl', function(req, res, next) {
    res.send(googleAuth.generateAuthUrl());
});

router.get('/oauth2callback', function(req, res, next) {
    //get and set the token using the callback code
    var code = req.query.code;
    googleAuth.getToken(code);
    //redirect the user to the homepage
    res.redirect('/');
});

module.exports = router;
