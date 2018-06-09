const express = require('express');

const router = express.Router();

router.get('/ma/', (req, res) => {
    res.render('index');
});

var names = ['fabi', 'maddin', 'rudi', 'tobi']
names.forEach((name) => {
    router.post(`/ma/${name}`, (req, res) => {
        res.render('vote', {
            name: name
        });
    });

    router.get(`/ma/${name}`, (req, res) => {
        res.render('vote', {
            name: name
        });
    });
});

module.exports = router;