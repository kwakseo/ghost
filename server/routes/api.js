// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const History = require('../models/history');
const router = express.Router();

// api endpoints
router.get('/test', function(req, res) {
    res.send('quack');
});

router.get('/whoami', function(req, res) {
    if(req.isAuthenticated()) {
        res.send(req.user);
    }
    else {
        res.send({});
    }
});


router.get('/user', function(req, res) {
    console.log('getting user');
    console.log(req)
    User.findOne({ _id: req.query._id }, function(err, user) {
        res.send(user);
        
    });
});

router.get('/history', function(req, res) {
    console.log('getting history')
    console.log(req.user._id);
    History.find({ player_id: req.user._id }, function(err, history) {
        res.send(history);
    });
});

module.exports = router;
