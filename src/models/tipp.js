const mongoose = require('mongoose');

var TippSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    player: {
        type: String,
        required: true,
        minlength: 1
    },
    games: [{
        homeTeam: {
            type: String,
            require: true
        },
        awayTeam: {
            type: String,
            require: true
        },
        tipp: {
            type: String,
            default: null
        }
    }]
});

var Tipp = mongoose.model('Tipp', TippSchema);

module.exports = {
    Tipp
};