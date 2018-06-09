const express = require('express');
const moment = require('moment');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {GameDay} = require('./models/gameday');

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

router.get('/createGameday', (req, res) => {
    var gameday = new GameDay({
        day: moment().format('YYYY-MM-DD'),
        name: 'Eröffnung',
        games: [{
            homeTeam: 'Deutschland',
            awayTeam: 'Mexiko'
        }]
    });

    gameday.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

module.exports = router;