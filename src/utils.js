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
    const points = [ranking["Fabi"], ranking["Maddin"], ranking["Robert"], ranking["Rudi"], ranking["Tobi"]];
    const orderedPoints = points.sort(function(a, b){return b-a});

    const names = ["Fabi", "Maddin", "Robert", "Rudi", "Tobi"];
    const orderedNames = [];

    var hightestPoints = 0;

    for (i = 0; i < names.length; i++) {
        for (p = 0; p < orderedPoints.length; p++) {
            if (ranking[names[i]] === orderedPoints[p]) {
                if (orderedPoints[p] >= hightestPoints) {
                    orderedNames.unshift(names[i]);
                    hightestPoints = orderedPoints[p];
                } else {
                    orderedNames.push(names[i]);
                }
                break;
            }
        }
    }

    return {
        names: orderedNames,
        points: orderedPoints
    }
};

module.exports = {
    calculatePoints,
    getRanking
};