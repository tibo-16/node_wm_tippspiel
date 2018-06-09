const express = require('express');
const moment = require('moment');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {GameDay} = require('./models/gameday');

const router = express.Router();

router.get('/ma', (req, res) => {
    res.render('index');
});

var names = ['fabi', 'maddin', 'rudi', 'tobi']
names.forEach((name) => {
    router.post(`/ma/${name}`, (req, res) => {
        res.send(name);
    });

    router.get(`/ma/${name}`, (req, res) => {
        let currentDate = moment().format('YYYY-MM-DD');

        GameDay.findOne({
            day: currentDate
        }).then((gameday) => {
            if (!gameday) {
                return res.status(404).send('Noch kein Speiltag verfügbar!');
            }

            res.render('vote', {
                day: gameday.day,
                name: gameday.name,
                games: gameday.games,
                player: name
            });
        }).catch((err) => {
            res.send(400).send(err);
        });
    });
});

// Nur als Test
router.post('/createGameday', (req, res) => {
    console.log(req.body);
    res.send('Good');
    // var gameday = new GameDay({
    //     day: req.body.day,
    //     name: req.body.name,
    //     games: [{
    //         homeTeam: req.body.homeTeam,
    //         awayTeam: req.body.awayTeam
    //     }]
    // });

    // gameday.save().then((doc) => {
    //     res.render('index');
    // }, (err) => {
    //     res.status(400).send(err);
    // });
});

module.exports = router;