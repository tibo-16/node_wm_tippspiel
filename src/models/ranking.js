const mongoose = require('mongoose');

var RankingSchema = new mongoose.Schema({
    Fabi: {
        type: Number,
        required: true
    },
    Maddin: {
        type: Number,
        required: true
    },
    Robert: {
        type: Number,
        required: true
    },
    Rudi: {
        type: Number,
        required: true
    },
    Tobi: {
        type: Number,
        required: true
    }
});

var Ranking = mongoose.model('Ranking', RankingSchema);

module.exports = {
    Ranking
};