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
        return 3;
    }

    if (resultDiff > 0 && tippDiff > 0) {
        return 1;
    }

    if (resultDiff < 0 && tippDiff < 0) {
        return 1;
    }

    return 0;
};

module.exports = {
    calculatePoints
};