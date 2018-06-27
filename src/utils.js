const _ = require('lodash');
var {mongoose} = require('./db/mongoose');
var {GameDay} = require('./models/gameday');
var {Tipp} = require('./models/tipp');
var {Ranking} = require('./models/ranking');

const calculatePoints = (result, tipp) => {
    if (result === tipp) {
        return 6;
    }

    var resultSplit = result.split(':');
    var tippSplit = tipp.split(':');

    var resultHome = parseInt(resultSplit[0]);
    var resultAway = parseInt(resultSplit[1]);
    var tippHome = parseInt(tippSplit[0]);
    var tippAway = parseInt(tippSplit[1]);

    var resultDiff = resultHome - resultAway;
    var tippDiff = tippHome - tippAway;

    if (resultDiff === tippDiff) {
        return 4;
    }

    if (resultDiff > 0 && tippDiff > 0) {
        return 3;
    }

    if (resultDiff < 0 && tippDiff < 0) {
        return 3;
    }

    return 0;
};

const getRanking = (ranking) => {
    var array = [{
        'player': 'Fabi',
        'points': ranking["Fabi"]
    }, {
        'player': 'Maddin',
        'points': ranking["Maddin"]
    }, {
        'player': 'Robert',
        'points': ranking["Robert"]
    }, {
        'player': 'Rudi',
        'points': ranking["Rudi"]
    }, {
        'player': 'Tobi',
        'points': ranking["Tobi"]
    }];

    const sortedArray = _.sortBy(array, ['points', 'player']);
    console.log(sortedArray);
    var orderedNames = [];
    var orderedPoints = [];
    
    for (i = 4; i >= 0; i--) {
        orderedNames.push(sortedArray[i].player);
        orderedPoints.push(sortedArray[i].points);
    }

    return {
        names: orderedNames,
        points: orderedPoints
    }
};

const rankingTest = async () => {
    const gamedays = await GameDay.find({completed: true});
    const names = ["Fabi", "Maddin", "Robert", "Rudi", "Tobi"];

    for (n = 0; n < names.length; n++) {
        var pointsForName = 0;

        for (i = 0; i < gamedays.length; i++) {
            const tipp = await Tipp.findOne({
                day: gamedays[i].day,
                player: names[n]
            });

            for (g = 0; g < gamedays[i].games.length; g++) {
                const points = calculatePoints(gamedays[i].games[g].result, tipp.games[g].tipp);
                pointsForName += points;
            }
        }

        //console.log(`${names[n]}: ${pointsForName}`);
    }
};

module.exports = {
    calculatePoints,
    getRanking,
    rankingTest
};