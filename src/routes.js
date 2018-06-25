const express = require('express');
var moment = require('moment');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {GameDay} = require('./models/gameday');
var {Tipp} = require('./models/tipp');
var {Ranking} = require('./models/ranking');
const {calculatePoints, getRanking, rankingTest} = require('./utils');

moment.locale('de');

const router = express.Router();

router.get('/ma', (req, res) => {
    res.redirect('/');
});

router.get('/', (req, res) => {
    //rankingTest();
    res.render('index');
});

var names = ['Fabi', 'Maddin', 'Robert', 'Rudi', 'Tobi']
names.forEach((name) => {
    router.post(`/${name}`, async (req, res) => {
        try {
            const gameday = await GameDay.findOne({completed: false});
            if (!gameday) {
                return res.status(404).render('info', {
                    message: 'Es ist noch kein weiterer Spieltag verfügbar!'
                });
            }

            const tipp = await Tipp.findOne({day: gameday.day, player: name});
            if (tipp) {
                // if (gameday.completed === true) {
                //     return res.render('voted', {
                //         day: gameday.day,
                //         name: gameday.name,
                //         games: tipp.games,
                //         deadline: gameday.deadline,
                //         player: name
                //     });
                // } else {
                //     return res.render('info', {
                //         message: "Du hast diesen Spieltag schon getippt!"
                //     });
                // }
                return res.render('info', {
                    message: "Du hast diesen Spieltag schon getippt!"
                });
            }

            if (moment(gameday.day + ' ' + gameday.deadline).isBefore(moment())) {
                return res.render('failure', {
                    message: `Die Deadline für diesen Spieltag ist leider angelaufen. Sie war um ${gameday.deadline} Uhr!`
                });
            }

            res.render('vote', {
                day: gameday.day,
                name: gameday.name,
                games: gameday.games,
                deadline: gameday.deadline,
                player: name
            });
        } catch (err) {
            res.status(400).send(err);
        }
    });

    router.get(`/${name}`, async (req, res) => {
        try {
            const gameday = await GameDay.findOne({completed: false});
            if (!gameday) {
                return res.status(404).render('info', {
                    message: 'Es ist noch kein weiterer Spieltag verfügbar!'
                });
            }

            const tipp = await Tipp.findOne({day: gameday.day, player: name});
            if (tipp) {
                // if (gameday.completed === true) {
                //     return res.render('voted', {
                //         day: gameday.day,
                //         name: gameday.name,
                //         games: tipp.games,
                //         deadline: gameday.deadline,
                //         player: name
                //     });
                // } else {
                //     return res.render('info', {
                //         message: "Du hast diesen Spieltag schon getippt!"
                //     });
                // }
                return res.render('info', {
                    message: "Du hast diesen Spieltag schon getippt!"
                });
            }

            if (moment(gameday.day + ' ' + gameday.deadline).isBefore(moment())) {
                return res.render('failure', {
                    message: `Die Deadline für diesen Spieltag ist leider angelaufen. Sie war um ${gameday.deadline} Uhr!`
                });
            }

            res.render('vote', {
                day: gameday.day,
                name: gameday.name,
                games: gameday.games,
                deadline: gameday.deadline,
                player: name
            });
        } catch (err) {
            res.status(400).send(err);
        }
    });
});

router.post('/createTipp', async (req, res) => {
    let checkTipp = await Tipp.findOne({day: req.body.day, player: req.body.player});
    if (checkTipp) {
        return res.render('info', {
            message: 'Du hast diesen Spieltag schon getippt!'
        });
    }

    let gameday = await GameDay.findOne({day: req.body.day});
    var gamesArray = [];

    for (i = 0; i < gameday.games.length; i++) {
        gamesArray.push({
            homeTeam: gameday.games[i].homeTeam,
            awayTeam: gameday.games[i].awayTeam,
            tipp: req.body["home" + i] + ":" + req.body["away" + i]
        });
    }

    const tipp = new Tipp({
        day: gameday.day,
        player: req.body.player,
        games: gamesArray
    });

    try {
        await tipp.save();
        res.status(200).render('success');
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/ranking', async (req, res) => {
    const ranking = await Ranking.findOne();

    const orderedRanking = getRanking(ranking);

    res.render('ranking', {
        names: orderedRanking.names,
        points: orderedRanking.points
    });
});

router.get('/tipps', async (req, res) => {
    const gameday = await GameDay.findOne({completed: true}).sort({day: 'desc'}).limit(1);
    if (!gameday) {
        return res.status(404).render('info', {
            message: "Kein Spieltag gefunden!"
        });
    }

    const names = ['Fabi', 'Maddin', 'Robert', 'Rudi', 'Tobi'];
    var tipps = [];

    for (i = 0; i < names.length; i++) {
        var tipp = await Tipp.findOne({
            day: gameday.day,
            player: names[i]
        });

        if (tipp) {
            tipps.push(tipp);
        }
    }

    res.render('tipps', {
        gameday: gameday,
        tipps: tipps
    });
});

router.get('/setResult/:day&:results', async (req, res) => {
    // Beispiel: /ma/setResult/2018-06-14&2:1-1:1-3:1
    var results = req.params.results.split('-');

    var gameday = await GameDay.findOne({
        day: req.params.day
    });

    for(i = 0; i < results.length; i++) {
        gameday.games[i].result = results[i];
    }
    gameday.completed = true;

    var newGameday = await GameDay.findOneAndUpdate({
        day: req.params.day
    }, {$set: gameday}, {new: true})

    // Ranking anpassen
    var ranking = await Ranking.findOne();
    var names = ['Fabi', 'Maddin', 'Robert', 'Rudi', 'Tobi']

    for (i = 0; i < names.length; i++) {
        var tipp = await Tipp.findOne({
            day: req.params.day,
            player: names[i]
        });

        if (tipp) {
            for (g = 0; g < newGameday.games.length; g++) {
                ranking[names[i]] += calculatePoints(newGameday.games[g].result, tipp.games[g].tipp);
            }
        }
    }

    await Ranking.findOneAndUpdate({}, {$set: ranking}, {new: true});
    
    res.send(newGameday);
});

router.get('/setDone/:day', async (req, res) => {
    var gameday = await GameDay.findOne({
        day: req.params.day
    });
    gameday.completed = true;

    var newGameday = await GameDay.findOneAndUpdate({
        day: req.params.day
    }, {$set: gameday}, {new: true})

    res.send(newGameday);
});

// NUR FÜR MICH
router.get('/createGamedayTest', (req, res) => {
    var gameday = new GameDay({
        day: "2018-06-14",
        name: "Eröffnung",
        deadline: "17:00",
        games: [{
            homeTeam: "Russland",
            awayTeam: "Saudi-Arabien"
        }, {
            homeTeam: "Deutschland",
            awayTeam: "England"
        }, {
            homeTeam: "Spanien",
            awayTeam: "Mexiko"
        }]
    });

    gameday.save().then((doc) => {
        res.send(gameday);
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