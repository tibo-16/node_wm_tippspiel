const mongoose = require('mongoose');

var RankingSchema = new mongoose.Schema({
    fabi: {
        type: Number,
        required: true
    },
    maddin: {
        type: Number,
        required: true
    },
    rudi: {
        type: Number,
        required: true
    },
    tobi: {
        type: Number,
        required: true
    }
});

var Ranking = mongoose.model('Ranking', RankingSchema);

module.exports = {
    Ranking
};