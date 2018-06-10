const express = require('express');
const moment = require('moment');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {GameDay} = require('./models/gameday');
var {Tipp} = require('./models/tipp');

const router = express.Router();

router.get('/ma', (req, res) => {
    res.render('index');
});

var names = ['fabi', 'maddin', 'rudi', 'tobi']
names.forEach((name) => {
    router.post(`/ma/${name}`, async (req, res) => {
        try {
            const gameday = await GameDay.findOne({completed: false});
            if (!gameday) {
                return res.status(404).send('Noch kein Speiltag verfügbar!');
            }

            if (moment(gameday.day + ' ' + gameday.deadline).isBefore(moment())) {
                return res.send(`Die Deadline für diesen Spieltag ist leider angelaufen. Sie war um ${gameday.deadline} Uhr!`);
            }

            const tipp = await Tipp.findOne({day: gameday.day, player: name});
            if (tipp) {
                return res.send('Du hast diesen Spieltag schon getippt!');
            }

            res.render('vote', {
                day: gameday.day,
                name: gameday.name,
                games: gameday.games,
                player: name
            });
        } catch (err) {
            res.status(400).send(err);
        }
    });

    router.get(`/ma/${name}`, async (req, res) => {
        try {
            const gameday = await GameDay.findOne({completed: false});
            if (!gameday) {
                return res.status(404).send('Noch kein Speiltag verfügbar!');
            }

            if (moment(gameday.day + ' ' + gameday.deadline).isBefore(moment())) {
                return res.send(`Die Deadline für diesen Spieltag ist leider angelaufen. Sie war um ${gameday.deadline} Uhr!`);
            }

            const tipp = await Tipp.findOne({day: gameday.day, player: name});
            if (tipp) {
                return res.send('Du hast diesen Spieltag schon getippt!');
            }

            res.render('vote', {
                day: gameday.day,
                name: gameday.name,
                games: gameday.games,
                player: name
            });
        } catch (err) {
            res.status(400).send(err);
        }

    });
});

router.post('/createTipp', (req, res) => {
    console.log(req.body);
    res.status(200).send();
});

router.get('/createGamedayTest', (req, res) => {
    var gameday = new GameDay({
        day: "2018-06-15",
        name: "Gruppenphase",
        deadline: "14:00",
        games: [{
            homeTeam: "Ägypten",
            awayTeam: "Uruguay"
        }, {
            homeTeam: "Marokko",
            awayTeam: "Iran"
        }, {
            homeTeam: "Portugal",
            awayTeam: "Spanien"
        }]
    });

    gameday.save().then((doc) => {
        res.render('index');
    }, (err) => {
        res.status(400).send(err);
    });
});

router.get('/createTippTest', (req, res) => {
    var tipp = new Tipp({
        day: "2018-06-14",
        player: "fabi",
        games: [{
            homeTeam: "Russland",
            awayTeam: "Saudi Arabien",
            tipp: "2:1"
        }]
    });

    tipp.save().then((doc) => {
        res.render('index');
    }, (err) => {
        res.status(400).send(err);
    });
});

module.exports = router;